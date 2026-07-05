"""
Coverage Path Planning for PaintForge Robots.

Implements boustrophedon (lawnmower) patterns optimized for large vertical walls and ceilings.
Future versions will integrate real-time LiDAR + vision feedback for dynamic obstacle avoidance and thickness-aware re-painting.

All outputs are engineering targets for simulation and bid support.
"""

from __future__ import annotations

import math
from typing import Tuple

from .models import PathPlan, SurfaceType


def plan_wall_coverage(
    width_m: float,
    height_m: float,
    spray_width_m: float = 0.8,
    overlap_pct: float = 0.15,
    edge_detail_pass: bool = True,
) -> PathPlan:
    """
    Generate coverage path plan for a vertical wall section.
    Returns total path length, estimated time, and coverage quality metrics.
    """
    if width_m <= 0 or height_m <= 0:
        raise ValueError("Wall dimensions must be positive")

    effective_width = spray_width_m * (1 - overlap_pct)
    num_passes = math.ceil(width_m / effective_width)

    # Main passes (horizontal or vertical? Assume vertical for gravity assist on overspray)
    main_path_length = num_passes * height_m

    # Edge detailing pass (perimeter + corners for quality)
    edge_length = 2 * (width_m + height_m) if edge_detail_pass else 0

    total_length = main_path_length + edge_length

    # Speed model: 0.6 m/s average travel including acceleration, turns, thickness control pauses
    avg_speed_m_per_min = 0.6 * 60
    time_min = total_length / avg_speed_m_per_min + 8  # +8 min for setup, calibration, QA scan

    coverage = min(99.5, 100 * (1 - (0.02 * (num_passes > 4))))  # Slight degradation on very wide walls

    return PathPlan(
        surface_type=SurfaceType.WALL,
        total_path_length_m=round(total_length, 1),
        estimated_time_minutes=round(time_min, 1),
        coverage_percentage=round(coverage, 1),
        overlap_pct=overlap_pct * 100,
        num_passes=num_passes,
        notes="Boustrophedon pattern with dedicated edge + corner detailing pass. On-robot vision will dynamically adjust for windows, outlets, and surface defects.",
    )


def plan_ceiling_coverage(
    length_m: float,
    width_m: float,
    spray_width_m: float = 0.8,
    overlap_pct: float = 0.12,
) -> PathPlan:
    """Ceiling plan - typically more efficient due to gravity and fewer edges."""
    area = length_m * width_m
    effective_width = spray_width_m * (1 - overlap_pct)
    num_passes = math.ceil(width_m / effective_width)  # Assume length is travel direction

    main_path = num_passes * length_m
    # Perimeter edge pass
    perimeter = 2 * (length_m + width_m)
    total_length = main_path + perimeter * 0.6  # Partial edge on ceiling

    avg_speed_m_per_min = 0.55 * 60  # Slightly slower overhead
    time_min = total_length / avg_speed_m_per_min + 12  # Longer setup for ceiling work

    coverage = 99.2

    return PathPlan(
        surface_type=SurfaceType.CEILING,
        total_path_length_m=round(total_length, 1),
        estimated_time_minutes=round(time_min, 1),
        coverage_percentage=round(coverage, 1),
        overlap_pct=overlap_pct * 100,
        num_passes=num_passes,
        notes="Optimized for overhead work. Robot uses downward airless + optional electrostatic assist. Edge detailing reduced vs walls.",
    )


def estimate_path_time(path: PathPlan, robot_speed_factor: float = 1.0) -> float:
    """Adjust time estimate based on robot model or conditions."""
    base_time = path.estimated_time_minutes
    return round(base_time / robot_speed_factor, 1)
