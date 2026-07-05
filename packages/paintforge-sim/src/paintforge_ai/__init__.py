"""
PaintForge AI - Professional tools for autonomous robotic painting simulation and analysis.

This package provides:
- Accurate ROI modeling aligned with PaintForge engineering targets
- Coverage path planning algorithms for walls and ceilings
- Job simulation and metrics (time, coverage, thickness consistency)
- CLI for contractors and engineers to run local what-if analyses
- Pydantic models for integration with InteriorFinish OS and future robot firmware

All models use conservative engineering targets until real pilot data (GTA 2026) is available.
"""

from .models import (
    RobotSpec,
    JobSpec,
    SimulationResult,
    ROIMetrics,
    PathPlan,
)
from .roi import calculate_roi, estimate_fleet_size, calculate_traditional_days
from .path_planning import plan_wall_coverage, plan_ceiling_coverage, estimate_path_time
from .simulation import simulate_painting_job

__version__ = "0.2.0"
__author__ = "Vince Ceccarelli"

__all__ = [
    "RobotSpec",
    "JobSpec",
    "SimulationResult",
    "ROIMetrics",
    "PathPlan",
    "calculate_roi",
    "estimate_fleet_size",
    "calculate_traditional_days",
    "plan_wall_coverage",
    "plan_ceiling_coverage",
    "estimate_path_time",
    "simulate_painting_job",
]
