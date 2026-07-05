from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator, ConfigDict


class SurfaceType(str, Enum):
    WALL = "wall"
    CEILING = "ceiling"
    BOTH = "both"


class CoatingType(str, Enum):
    PRIMER = "primer"
    PAINT = "paint"
    TOPCOAT = "topcoat"
    EPOXY = "epoxy"
    LOW_VOC = "low_voc"


class RobotSpec(BaseModel):
    """Engineering target specification for the PaintForge autonomous painting robot (pre-pilot validation)."""
    model_config = ConfigDict(frozen=True)

    name: str = Field(default="PaintForge Alpha", description="Robot model identifier")
    max_reach_vertical: float = Field(default=4.2, description="Maximum vertical reach in meters (engineering target)")
    spray_width: float = Field(default=0.8, description="Effective spray width per pass in meters")
    max_flow_rate_lpm: float = Field(default=2.5, description="Maximum airless flow rate liters per minute")
    target_thickness_tolerance_mil: float = Field(default=2.0, description="Closed-loop thickness tolerance ± mil")
    daily_coverage_sqft_per_coat: float = Field(
        default=1200.0, description="Target daily coverage per robot per coat (sqft) - engineering goal"
    )
    utilization_factor: float = Field(
        default=0.75, description="Expected field utilization accounting for setup, charging, breaks"
    )
    labor_reduction_factor: float = Field(
        default=0.70, description="Target labor hour reduction vs traditional crew (70% typical)"
    )
    avg_speed_gain: float = Field(default=3.8, description="Speed multiplier vs manual crew (3.8x target)")


class JobSpec(BaseModel):
    """Specification for a painting job/project."""
    model_config = ConfigDict(frozen=True)

    project_name: str = Field(..., min_length=3)
    total_sqft: float = Field(..., gt=0, description="Total paintable surface area in square feet")
    num_coats: int = Field(default=2, ge=1, le=5)
    surface_type: SurfaceType = Field(default=SurfaceType.BOTH)
    coating_type: CoatingType = Field(default=CoatingType.PAINT)
    labor_rate_cad_per_hr: float = Field(
        default=52.0, description="Fully burdened Ontario/GTA union or skilled labor rate CAD/hr (2026 est.)"
    )
    paint_cost_per_sqft: float = Field(default=1.85, description="Material cost per sqft per coat CAD")
    current_crew_size: int = Field(default=4, ge=1)
    target_completion_days: Optional[int] = Field(default=None, description="Customer desired max days")
    region: str = Field(default="GTA", description="Geographic region for labor rates & regulations")


class ROIMetrics(BaseModel):
    """Output metrics from ROI calculation - all labeled as targets until pilot data."""
    model_config = ConfigDict(frozen=True)

    fleet_size: int = Field(..., description="Recommended number of robots for parallel work")
    traditional_days: float = Field(..., description="Estimated days with traditional crew")
    robot_days: float = Field(..., description="Estimated days with PaintForge fleet (target)")
    speed_gain_pct: float = Field(..., description="Percentage speed improvement (target)")
    labor_cost_traditional: float = Field(..., description="Traditional labor cost CAD (target model)")
    labor_cost_robot: float = Field(..., description="Robot-assisted labor cost CAD (target)")
    labor_savings_pct: float = Field(..., description="Labor cost savings percentage (target)")
    material_cost: float = Field(..., description="Total material cost CAD")
    robot_operating_cost_per_day: float = Field(..., description="Estimated RaaS operating cost per robot/day")
    total_robot_cost: float = Field(..., description="Total project cost with robots (RaaS + reduced labor)")
    payback_months: float = Field(..., description="Estimated payback period in months for contractor (target)")
    confidence: str = Field(default="Engineering target - awaiting 2026 GTA pilot validation")


class PathPlan(BaseModel):
    """Coverage path planning result."""
    model_config = ConfigDict(frozen=True)

    surface_type: SurfaceType
    total_path_length_m: float
    estimated_time_minutes: float
    coverage_percentage: float = Field(ge=0, le=100)
    overlap_pct: float = Field(default=15.0)
    num_passes: int
    notes: str = Field(default="Boustrophedon (lawnmower) pattern with edge detailing pass. Subject to on-site LiDAR scan optimization.")


class SimulationResult(BaseModel):
    """Full simulation output for a painting job."""
    model_config = ConfigDict(frozen=True)

    job: JobSpec
    robot_spec: RobotSpec
    roi: ROIMetrics
    wall_plan: Optional[PathPlan] = None
    ceiling_plan: Optional[PathPlan] = None
    quality_notes: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    version: str = Field(default="0.2.0-pilot-targets")
