# paintforge-ai

Simulation, ROI modeling, and coverage path-planning tools for the
**PaintForge** autonomous painting platform.

**Honesty contract:** every number this package produces is an
*engineering target* for the 2026 GTA pilot program, not a measured field
result. The models are transparent and auditable on purpose — contractors
and design partners can inspect every assumption. Pilot data will replace
targets as it lands.

## Install

```bash
pip install -e ".[dev]"   # from packages/paintforge-sim
```

## Usage

```python
from paintforge_ai.models import JobSpec
from paintforge_ai.roi import calculate_roi

job = JobSpec(project_name="Demo Tower L12", total_sqft=85_000,
              num_coats=3, current_crew_size=8)
metrics = calculate_roi(job)
print(metrics.fleet_size, metrics.robot_days, metrics.labor_savings_pct)
```

CLI:

```bash
paintforge version
paintforge simulate --project "Demo Tower" --sqft 85000 --coats 3
```

## Modules

- `models` — pydantic specs: `RobotSpec` (engineering targets), `JobSpec`, `ROIMetrics`, `PathPlan`
- `roi` — fleet sizing, timeline, and labor-savings model (mirrors the website calculator)
- `path_planning` — boustrophedon wall/ceiling coverage plans with edge-detail passes
- `simulation` — end-to-end job simulation combining ROI + path plans + quality notes
- `cli` — `paintforge` command (typer + rich)

## Tests

```bash
python -m pytest
```
