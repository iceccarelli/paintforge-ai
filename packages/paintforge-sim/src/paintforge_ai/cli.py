"""
PaintForge AI Command Line Interface

Professional tool for contractors, estimators, and engineers.
Run local simulations without internet. Perfect companion to the PaintForge pilot program.

Examples:
  paintforge roi --sqft 85000 --coats 2 --crew 5
  paintforge plan-wall --width 18 --height 3.2
  paintforge simulate --project "Data Center Phase 2" --sqft 250000 --region "GTA"
"""

from __future__ import annotations

import json
from typing import Optional

import typer
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich import print as rprint

from .models import JobSpec, RobotSpec, SurfaceType, CoatingType
from .roi import calculate_roi
from .path_planning import plan_wall_coverage, plan_ceiling_coverage
from .simulation import simulate_painting_job

app = typer.Typer(
    name="paintforge",
    help="PaintForge AI - Simulation & Planning Tools for Autonomous Robotic Painting | v0.2.0 (Pilot Targets)",
    add_completion=True,
    rich_markup_mode="rich",
)
console = Console()


@app.command("roi")
def roi_command(
    sqft: float = typer.Option(50000, "--sqft", "-s", help="Total paintable sqft"),
    coats: int = typer.Option(2, "--coats", "-c", help="Number of coats"),
    crew: int = typer.Option(4, "--crew", help="Current crew size"),
    labor_rate: float = typer.Option(52.0, "--labor-rate", help="CAD per hour fully burdened (Ontario 2026)"),
    paint_cost: float = typer.Option(1.85, "--paint-cost", help="CAD per sqft per coat"),
    region: str = typer.Option("GTA", "--region", help="Region for labor assumptions"),
):
    """Calculate detailed ROI for a project using PaintForge engineering targets."""
    job = JobSpec(
        project_name="CLI Project",
        total_sqft=sqft,
        num_coats=coats,
        current_crew_size=crew,
        labor_rate_cad_per_hr=labor_rate,
        paint_cost_per_sqft=paint_cost,
        region=region,
    )
    metrics = calculate_roi(job)

    table = Table(title=f"PaintForge ROI Analysis — {sqft:,.0f} sqft | {coats} coats", show_header=True)
    table.add_column("Metric", style="cyan")
    table.add_column("Value", style="green")
    table.add_column("Notes", style="dim")

    table.add_row("Recommended Fleet", str(metrics.fleet_size), "Parallel operation")
    table.add_row("Traditional Timeline", f"{metrics.traditional_days} days", "Current crew model")
    table.add_row("With Robots (target)", f"{metrics.robot_days} days", "Engineering target")
    table.add_row("Speed Gain", f"+{metrics.speed_gain_pct}%", "vs manual")
    table.add_row("Labor Cost Savings", f"{metrics.labor_savings_pct}%", f"${metrics.labor_cost_traditional:,.0f} → ${metrics.labor_cost_robot:,.0f}")
    table.add_row("Total Project Cost (RaaS)", f"${metrics.total_robot_cost:,.0f} CAD", "Includes reduced labor + materials")
    table.add_row("Est. Payback", f"{metrics.payback_months} months", "For similar repeat projects")

    console.print(table)
    rprint(Panel(metrics.confidence, title="[bold yellow]Important[/bold yellow]", border_style="yellow"))


@app.command("plan-wall")
def plan_wall(
    width: float = typer.Option(12.0, "--width", "-w", help="Wall width in meters"),
    height: float = typer.Option(3.0, "--height", "-h", help="Wall height in meters"),
):
    """Generate coverage path plan for a wall section."""
    plan = plan_wall_coverage(width, height)
    rprint(Panel.fit(
        f"[bold]Wall Path Plan[/bold]\n"
        f"Passes: {plan.num_passes} | Length: {plan.total_path_length_m}m | Time: {plan.estimated_time_minutes} min\n"
        f"Coverage: {plan.coverage_percentage}% | Overlap: {plan.overlap_pct}%\n\n"
        f"[dim]{plan.notes}[/dim]",
        title="PaintForge Path Planner",
    ))


@app.command("simulate")
def simulate(
    project: str = typer.Option("Sample Commercial Project", "--project", "-p"),
    sqft: float = typer.Option(120000, "--sqft"),
    coats: int = typer.Option(2, "--coats"),
    region: str = typer.Option("GTA", "--region"),
    output: Optional[str] = typer.Option(None, "--output", "-o", help="Save JSON result to file"),
):
    """Run complete job simulation (ROI + path planning + quality report)."""
    job = JobSpec(project_name=project, total_sqft=sqft, num_coats=coats, region=region)
    result = simulate_painting_job(job)

    rprint(Panel(f"[bold green]Simulation Complete[/bold green] — {project}", expand=False))

    # Print key ROI
    roi = result.roi
    console.print(f"Fleet: [bold]{roi.fleet_size}[/bold] robots | Timeline: [bold]{roi.robot_days}[/bold] days (was {roi.traditional_days}) | Savings: [bold green]{roi.labor_savings_pct}%[/bold green] labor")

    if output:
        with open(output, "w") as f:
            f.write(result.model_dump_json(indent=2))
        rprint(f"[green]Full JSON saved to {output}[/green]")


@app.command("version")
def version():
    """Show package version and target status."""
    rprint("[bold]paintforge-ai[/bold] v0.2.0 | Engineering Targets for 2026 GTA Pilot Program")
    rprint("Real field data will replace targets after pilot validation. Use for planning & bid support only.")


if __name__ == "__main__":
    app()
