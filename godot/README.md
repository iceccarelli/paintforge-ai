# PaintForge Pro Simulator (Godot 4)

The flagship high-fidelity twin. The Next.js site is the shop window; this is the
room you walk into. `Main.gd` builds a runnable articulated robot from primitives
so the project works today — you then swap primitives for modelled subassemblies
without rewriting the animation, cutaway, explode, or job wiring.

> Everything here is a **concept**. Keep the on-screen "all values are targets"
> banner until real hardware exists.

## 1. Scene structure

```
Main.tscn                (Node3D + Main.gd)   ← entry scene, builds everything
└─ (runtime) 
   ├─ WorldEnvironment / DirectionalLight ×2 / floor
   ├─ Base            (Node3D)      mobile chassis
   │   ├─ Shell       (CSGCombiner3D)  ← carved open in cutaway
   │   ├─ Motor.L / Motor.R (Node3D → Rotor spins)
   │   ├─ Battery / Controller / Wheels ×4
   ├─ Column          (Node3D)      lift mast
   │   ├─ Shell (CSGCombiner3D) · LeadScrew (spins) · Carriage · LiftServo
   ├─ Head            (Node3D)      spray head (tracks the active wall cell)
   │   ├─ Gearbox (2 meshing gears) · Pump (reciprocating piston) · Nozzle · Hose
   ├─ Wall            (Node3D)      COLS×ROWS quads revealed boustrophedon-order
   ├─ Camera3D ×4     overview / head / base internals / coverage
   └─ CanvasLayer/HUD
```

When you move to modelled assets, keep these **node names** — the script finds
parts by structure, and named `AnimationPlayer` tracks target the same nodes.

## 2. Recommended target structure (after Blender)

Split the machine into one `.glb` **per subassembly**, each with internals as
separate meshes so they can be shown/hidden/exploded independently:

```
assets/
  base.glb            → Chassis, Motor_L{Stator,Rotor,Shaft,Windings}, Battery, PCB, Harness
  column.glb          → Mast, LeadScrew, ScrewThreads, Carriage, LiftServo{Stator,Rotor}
  head.glb            → GearboxHousing, GearA(18t), GearB(12t), Pump{Cylinder,Piston,Valves}, Nozzle
  materials/          → shared StandardMaterial3D (steel, copper, PCB, paint)
scenes/
  Robot.tscn          → instances the three .glb, re-parents named nodes
  ProSim.tscn         → Robot + Wall + Cameras + HUD + PathPlanner
```

## 3. Modelling & animating internals (Blender → Godot)

**Model each moving part as its own object** — never merge a rotor into its
stator. Naming is the contract with GDScript/animation.

1. **Rotors / shafts** — model the laminations + windings as separate meshes,
   parent them to an empty `Rotor` at the true rotation axis. Set the object
   origin **on the axis** (Object → Set Origin → Origin to 3D Cursor on the
   centreline) so `rotate_z` looks physically correct. Don't bake spin in
   Blender — spin it in Godot (`Main.gd` already does, at realistic rad/s).
2. **Gears** — model real involute teeth (Blender *Add Mesh: Extra Objects → Gears*
   or the *Mechanical* add-on). Two gears, origins on their axes, tooth counts
   matching the ratio (18:12 here). Godot turns them opposite at the ratio, so
   teeth appear to mesh.
3. **Lead screw** — model the thread as a swept helix; spin about Y. The carriage
   is a separate node you drive up/down in an `AnimationPlayer` synced to spin.
4. **Switches / buttons / connectors** — tiny separate meshes; toggle with a
   1–2 frame `AnimationPlayer` track or a shader emission flip in GDScript.
5. **Paint pump** — piston as its own object; reciprocate in code (already wired)
   or an `AnimationPlayer` sine track. Add a check-ball object for realism.
6. **Wiring** — a Curve/Bevel in Blender exported as mesh, or Godot `Path3D` +
   `CSGPolygon3D` in path mode for editable harnesses.

**Export:** glTF 2.0 `.glb`, +Y up, apply transforms, one file per subassembly.
In Godot's import dock set meshes to *Separate* so each internal stays its own
`MeshInstance3D`. Assign shared materials as `StandardMaterial3D` resources.

**Cutaway two ways** — the scaffold uses **CSG subtraction** (a hidden
`OPERATION_SUBTRACTION` box toggled on) which literally carves the housing in 3D
and needs no shader. For high mesh counts, switch to a **clip-plane shader**
(`clip_space`/`discard` on world position) applied only to shell materials, so
internals never clip — same idea as the web build's `THREE.Plane`.

## 4. Exports

**Web (HTML5):** Project → Export → Web. Set *Head Include* to allow the query
string, tick *Focus Canvas on Start*. Output to `paintforge-ai/public/pro-sim/`
so Next serves it at `/pro-sim/`; point `NEXT_PUBLIC_PRO_SIM_URL=/pro-sim/`.
Requires cross-origin isolation for threads — either export **single-threaded**,
or add COOP/COEP headers in `next.config.ts` / `vercel.json` for the `/pro-sim`
route. Single-threaded is the simplest first ship.

**Desktop:** export Windows (`.exe`), macOS (`.app`/`.dmg` — sign + notarize),
Linux (`.AppImage`). Host under `NEXT_PUBLIC_PRO_SIM_DESKTOP`. Accept the same
params as `--job="sqft=8400&coats=3&surface=wall"` (already parsed in
`_read_job()`), or register a `paintforge://` URL scheme for deep links.

## 5. Job hand-off from the site

The web build reads `window.location.search`; the desktop build reads
`--job=...`. `ProSimulatorLauncher.tsx` builds that query from whatever the
visitor configured (ROI calculator sqft/coats, selected robot). Extend
`_apply_job()` to scale the wall, set pass count, or preselect a robot — but keep
it a **concept** sim; never present a simulated run as a real field result.
