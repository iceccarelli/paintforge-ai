from __future__ import annotations

import math
from datetime import datetime, timezone
from typing import List

from .models import JobSpec, RobotSpec, SimulationResult, SurfaceType
from .roi import calculate_roi
from .path_planning import plan_wall_coverage, plan_ceiling_coverage


def simulate_painting_job(
    job: JobSpec,
    robot: RobotSpec | None = None,
    include_path_planning: bool = True,
) -> SimulationResult:
    """
    Run full end-to-end simulation for a contractor job.
    Combines ROI, path planning, and quality notes.
    Perfect for bid support and pilot program applications.
    """
    if robot is None:
        robot = RobotSpec()

    roi = calculate_roi(job, robot)

    wall_plan = None
    ceiling_plan = None

    if include_path_planning:
        # Assume average commercial wall section for demo (real will use site scan)
        # For simplicity, derive approximate dimensions from sqft (assume 3m high walls)
        if job.surface_type in (SurfaceType.WALL, SurfaceType.BOTH):
            # Rough: assume average wall height 3.0m, derive total linear meters
            wall_area = job.total_sqft * 0.6  # 60% walls typical mix
            wall_linear_m = wall_area / 3.0
            wall_width_approx = min(25.0, wall_linear_m / 4)  # Assume 4 sections
            wall_plan = plan_wall_coverage(wall_width_approx, 3.0)

        if job.surface_type in (SurfaceType.CEILING, SurfaceType.BOTH):
            ceiling_area = job.total_sqft * 0.4
            ceil_l = math.sqrt(ceiling_area * 1.5)
            ceil_w = ceiling_area / ceil_l
            ceiling_plan = plan_ceiling_coverage(ceil_l, ceil_w)

    quality_notes: List[str] = [
        "All thickness control uses closed-loop real-time sensing (target ±2 mil).",
        "Vision system will flag surface defects, poor prep, and previous coat issues before spraying.",
        "Multi-coat scheduling optimized to manufacturer recoat windows.",
        "Full digital twin + quality report (thickness heatmaps, coverage map, timestamped photos) delivered post-job via InteriorFinish OS.",
        "Safety: Geo-fenced operation + force/torque limiting + e-stop. CSA/ISO compliant design targets.",
    ]

    if job.coating_type.value == "low_voc":
        quality_notes.append("Low-VOC / Green coating mode enabled. Ventilation & monitoring protocols active.")

    return SimulationResult(
        job=job,
        robot_spec=robot,
        roi=roi,
        wall_plan=wall_plan,
        ceiling_plan=ceiling_plan,
        quality_notes=quality_notes,
        timestamp=datetime.now(timezone.utc),
    )
