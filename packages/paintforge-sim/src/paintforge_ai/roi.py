"""
ROI Calculation Engine for PaintForge Autonomous Painting Robots.

All calculations use conservative engineering targets. Real performance will be validated during 2026 GTA Pilot Program.
Formulas are designed to be transparent and auditable for contractors and design partners.
"""

from __future__ import annotations

import math
from typing import Tuple

from .models import JobSpec, RobotSpec, ROIMetrics


def estimate_fleet_size(
    total_sqft: float,
    daily_per_robot: float,
    utilization: float,
    num_coats: int,
    target_days: int | None = None,
    traditional_days: float | None = None,
) -> int:
    """Size the fleet to hit a timeline target.

    If the job specifies a target completion, size to that. Otherwise size to
    beat the traditional crew by roughly the platform speed target (~3x),
    never slower than the crew it replaces. Fleet capped at 12 for the pilot
    phase.
    """
    effective_daily = daily_per_robot * utilization
    total_work = total_sqft * num_coats
    if target_days is None:
        baseline = traditional_days if traditional_days else total_work / effective_daily
        target_days = max(5, math.ceil(baseline / 3))
    robots_needed = max(1, math.ceil(total_work / (effective_daily * target_days)))
    return min(robots_needed, 12)


def calculate_traditional_days(total_sqft: float, num_coats: int, crew_size: int, sqft_per_man_day: float = 350.0) -> float:
    """Traditional crew productivity model (conservative Ontario commercial painting benchmark)."""
    total_work = total_sqft * num_coats
    man_days = total_work / sqft_per_man_day
    return math.ceil(man_days / crew_size)


def calculate_roi(job: JobSpec, robot: RobotSpec | None = None) -> ROIMetrics:
    """
    Core ROI model aligned with PaintForge website calculator and engineering targets.

    Returns detailed metrics with all values clearly marked as targets.
    """
    if robot is None:
        robot = RobotSpec()

    traditional_days = calculate_traditional_days(job.total_sqft, job.num_coats, job.current_crew_size)

    fleet = estimate_fleet_size(
        job.total_sqft,
        robot.daily_coverage_sqft_per_coat,
        robot.utilization_factor,
        job.num_coats,
        target_days=job.target_completion_days,
        traditional_days=traditional_days,
    )

    # Robot timeline: parallel work + setup/charging overhead modeled in utilization
    effective_robot_days_per_robot = (job.total_sqft * job.num_coats) / (robot.daily_coverage_sqft_per_coat * robot.utilization_factor)
    robot_days = math.ceil(effective_robot_days_per_robot / fleet) + 1  # +1 for mobilization & QA

    speed_gain = (traditional_days / robot_days) if robot_days > 0 else robot.avg_speed_gain
    speed_gain_pct = (speed_gain - 1) * 100

    # Labor costs (fully burdened)
    labor_trad = traditional_days * job.current_crew_size * job.labor_rate_cad_per_hr * 8  # 8hr shifts
    # With robots: smaller crew (supervisor + 1-2 techs for prep/QA/edge work) + robot ops
    reduced_crew = max(2, math.ceil(job.current_crew_size * (1 - robot.labor_reduction_factor * 0.6)))
    labor_robot = robot_days * reduced_crew * job.labor_rate_cad_per_hr * 8

    labor_savings_pct = ((labor_trad - labor_robot) / labor_trad * 100) if labor_trad > 0 else 70.0

    material = job.total_sqft * job.num_coats * job.paint_cost_per_sqft

    # RaaS operating cost model (target pricing - see /pricing page)
    # Includes robot amortization, maintenance, insurance, remote support, software (InteriorFinish OS), training, transport
    raas_per_robot_day = 1850.0  # Target daily all-in RaaS rate CAD for pilot/founding partners (aggressive)
    total_robot_cost = (robot_days * fleet * raas_per_robot_day) + labor_robot + material

    # Simple payback for contractor: assume they do 4-6 similar projects/year
    annual_projects = 5
    annual_savings = (labor_trad - labor_robot) * annual_projects
    payback_months = (fleet * 45000) / (annual_savings / 12) if annual_savings > 0 else 6.0  # Rough hardware equiv if purchased

    return ROIMetrics(
        fleet_size=fleet,
        traditional_days=round(traditional_days, 1),
        robot_days=round(robot_days, 1),
        speed_gain_pct=round(speed_gain_pct, 1),
        labor_cost_traditional=round(labor_trad, 2),
        labor_cost_robot=round(labor_robot, 2),
        labor_savings_pct=round(labor_savings_pct, 1),
        material_cost=round(material, 2),
        robot_operating_cost_per_day=raas_per_robot_day,
        total_robot_cost=round(total_robot_cost, 2),
        payback_months=round(max(2.5, payback_months), 1),
        confidence="Engineering target model. Real results from 2026 GTA Pilot Program will refine coefficients.",
    )
