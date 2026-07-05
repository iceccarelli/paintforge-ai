import pytest
from paintforge_ai.models import JobSpec
from paintforge_ai.roi import calculate_roi, estimate_fleet_size


def test_calculate_roi_basic():
    job = JobSpec(project_name="Test Warehouse", total_sqft=50000, num_coats=2, current_crew_size=4)
    metrics = calculate_roi(job)
    assert metrics.fleet_size >= 1
    assert metrics.robot_days < metrics.traditional_days
    assert metrics.labor_savings_pct > 50
    assert "Engineering target" in metrics.confidence


def test_fleet_size_reasonable():
    fleet = estimate_fleet_size(200000, 1200, 0.75, 2)
    assert 2 <= fleet <= 8


def test_robots_beat_large_crews():
    """Regression: fleet sizing must never produce a robot timeline slower
    than the manual crew it replaces (bug in original heuristic)."""
    job = JobSpec(project_name="Big Tower", total_sqft=85000, num_coats=3, current_crew_size=8)
    m = calculate_roi(job)
    assert m.robot_days < m.traditional_days
    assert m.fleet_size <= 12


def test_target_timeline_respected():
    job = JobSpec(project_name="Rush Job", total_sqft=60000, num_coats=2, current_crew_size=6, target_completion_days=15)
    m = calculate_roi(job)
    assert m.robot_days <= 15 + 1  # +1 mobilization/QA day
