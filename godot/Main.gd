extends Node3D
## PaintForge Pro Simulator — scaffold.
##
## Builds the PF-1 concept unit procedurally (base + lift mast + spray head) so
## the project RUNS before any Blender assets exist. Replace the procedural
## primitives with imported .glb subassemblies (see godot/README.md) once the
## detailed internals are modelled — the animation, cutaway, explode and job
## wiring below keep working with named nodes.
##
## Controls:  P run/pause · C cutaway · X explode · Z slow-mo · Space next camera
## Job params arrive from the web query string or desktop CLI (see _read_job()).

# ---- tunables ----------------------------------------------------------------
const COLS := 18
const ROWS := 11
const PAINT := Color(0.231, 0.490, 0.847)
const ORANGE := Color(1.0, 0.42, 0.208)
const NAVY := Color(0.039, 0.145, 0.251)

var running := true
var cutaway := false
var exploded := false
var slowmo := false
var speed := 1.0

var base: Node3D
var column: Node3D
var head: Node3D
var rotors: Array[Node3D] = []
var gears: Array[Dictionary] = []      # {node, dir}
var piston: MeshInstance3D
var lead_screw: Node3D
var cut_boxes: Array[CSGBox3D] = []     # subtraction volumes toggled by cutaway
var explode_targets: Array[Dictionary] = []  # {node, solid:Vector3, blown:Vector3}

var wall_cells: Array[MeshInstance3D] = []
var order: Array[Vector2i] = []
var painted := 0.0

var cameras: Array[Camera3D] = []
var cam_index := 0

var hud: Label
var job := {}

# ------------------------------------------------------------------------------
func _ready() -> void:
	job = _read_job()
	_build_environment()
	_build_robot()
	_build_wall()
	_build_cameras()
	_build_hud()
	_apply_job()

func _process(delta: float) -> void:
	var dt := delta * (0.15 if slowmo else 1.0)
	# spin every rotor / gear / screw
	if running:
		for r in rotors:
			r.rotate_z(9.0 * dt)
		for g in gears:
			g.node.rotate_z(g.dir * 6.0 * dt)
		if lead_screw:
			lead_screw.rotate_y(6.0 * dt)
		if piston:
			piston.position.y = -0.02 + sin(Time.get_ticks_msec() * 0.01 * (0.15 if slowmo else 1.0)) * 0.08
		_advance_coverage(dt)
	# smoothly move explode targets
	for e in explode_targets:
		var goal: Vector3 = e.blown if exploded else e.solid
		e.node.position = e.node.position.lerp(goal, delta * 6.0)
	_update_hud()

func _unhandled_input(_e: InputEvent) -> void:
	if Input.is_action_just_pressed("toggle_run"): running = not running
	if Input.is_action_just_pressed("toggle_cutaway"): _set_cutaway(not cutaway)
	if Input.is_action_just_pressed("toggle_explode"): exploded = not exploded
	if Input.is_action_just_pressed("toggle_slowmo"): slowmo = not slowmo
	if Input.is_action_just_pressed("cam_next"): _next_camera()

# ---- environment -------------------------------------------------------------
func _build_environment() -> void:
	var env := WorldEnvironment.new()
	var e := Environment.new()
	e.background_mode = Environment.BG_COLOR
	e.background_color = NAVY
	e.ambient_light_color = Color(0.35, 0.45, 0.6)
	e.ambient_light_energy = 0.6
	env.environment = e
	add_child(env)

	var key := DirectionalLight3D.new()
	key.rotation_degrees = Vector3(-50, -40, 0)
	key.light_energy = 1.8
	key.shadow_enabled = true
	add_child(key)

	var rim := DirectionalLight3D.new()
	rim.rotation_degrees = Vector3(-20, 140, 0)
	rim.light_color = ORANGE
	rim.light_energy = 0.5
	add_child(rim)

	var floor := MeshInstance3D.new()
	var pm := PlaneMesh.new(); pm.size = Vector2(10, 10)
	floor.mesh = pm
	floor.material_override = _mat(Color(0.09, 0.13, 0.2), 0.1, 0.9)
	add_child(floor)

# ---- robot -------------------------------------------------------------------
func _build_robot() -> void:
	# BASE ---------------------------------------------------------------------
	base = Node3D.new(); base.position = Vector3(0, 0.28, 0); add_child(base)
	_shell(base, _box(1.3, 0.42, 0.95), Vector3.ZERO, NAVY)
	# drive motors (rotors spin)
	for x in [-0.45, 0.45]:
		var m := _motor(base, Vector3(x, -0.02, 0.28))
		_explode(m, Vector3(x, -0.02, 0.28), Vector3(x, -0.02, 0.7))
	# battery + controller (internals stay visible in cutaway)
	var batt := _part(base, _box(0.8, 0.22, 0.24), Vector3(0, -0.02, -0.28), Color(0.18, 0.49, 0.27))
	_explode(batt, Vector3(0, -0.02, -0.28), Vector3(0, -0.02, -0.65))
	_part(base, _box(0.5, 0.02, 0.3), Vector3(0.1, 0.12, 0), Color(0.07, 0.21, 0.12))
	# wheels
	for x in [-0.55, 0.55]:
		for z in [-0.42, 0.42]:
			_part(base, _cyl(0.18, 0.12), Vector3(x, -0.24, z), Color(0.1, 0.14, 0.19), Vector3(0, 0, 90))

	# COLUMN -------------------------------------------------------------------
	column = Node3D.new(); column.position = Vector3(0, 1.05, -0.1); add_child(column)
	_shell(column, _box(0.34, 1.5, 0.34), Vector3.ZERO, Color(0.22, 0.25, 0.30))
	lead_screw = _lead_screw(column)
	_explode(column, Vector3(0, 1.05, -0.1), Vector3(0, 1.15, -0.1))

	# HEAD ---------------------------------------------------------------------
	head = Node3D.new(); head.position = Vector3(0, 1.9, 0.15); add_child(head)
	_gearbox(head, Vector3(0, 0, -0.15))
	_pump(head, Vector3(0.15, 0, 0.15))
	_part(head, _cone(0.05, 0.16), Vector3(0, -0.12, 0.4), Color(0.04, 0.09, 0.14), Vector3(90, 0, 0))
	_explode(head, Vector3(0, 1.9, 0.15), Vector3(0, 1.9, 0.6))

# a CSG shell that the cutaway box carves open
func _shell(parent: Node3D, mesh_res, pos: Vector3, col: Color) -> void:
	var comb := CSGCombiner3D.new()
	comb.position = pos
	comb.use_collision = false
	var shell := CSGMesh3D.new()
	shell.mesh = mesh_res
	shell.material = _mat(col, 0.65, 0.35)
	comb.add_child(shell)
	# subtraction volume (front-right quadrant) — enabled only in cutaway
	var cut := CSGBox3D.new()
	cut.size = Vector3(3, 3, 3)
	cut.position = Vector3(1.5, 0, 1.5)
	cut.operation = CSGShape3D.OPERATION_SUBTRACTION
	cut.visible = false
	comb.add_child(cut)
	cut_boxes.append(cut)
	parent.add_child(comb)

func _motor(parent: Node3D, pos: Vector3) -> Node3D:
	var g := Node3D.new(); g.position = pos; parent.add_child(g)
	_shell(g, _cyl(0.16, 0.34), Vector3.ZERO, Color(0.36, 0.4, 0.46))
	var rotor := Node3D.new(); g.add_child(rotor)
	_part(rotor, _cyl(0.11, 0.36), Vector3.ZERO, Color(0.78, 0.48, 0.23), Vector3(90, 0, 0))
	for i in 8:
		var a := TAU * i / 8.0
		_part(rotor, _box(0.03, 0.34, 0.05), Vector3(cos(a) * 0.13, sin(a) * 0.13, 0),
			Color(0.23, 0.16, 0.09), Vector3(90, 0, 0))
	_part(rotor, _cyl(0.03, 0.6), Vector3.ZERO, Color(0.79, 0.82, 0.87), Vector3(90, 0, 0))
	rotors.append(rotor)
	return g

func _gearbox(parent: Node3D, pos: Vector3) -> void:
	var g := Node3D.new(); g.position = pos; parent.add_child(g)
	_shell(g, _box(0.7, 0.5, 0.22), Vector3.ZERO, Color(0.28, 0.32, 0.37))
	gears.append({ "node": _gear(g, Vector3(-0.16, 0, 0.14), 18, 0.18), "dir": 1.0 })
	gears.append({ "node": _gear(g, Vector3(0.18, 0, 0.14), 12, 0.12), "dir": -1.5 })

func _gear(parent: Node3D, pos: Vector3, teeth: int, r: float) -> Node3D:
	var g := Node3D.new(); g.position = pos; parent.add_child(g)
	_part(g, _cyl(r, 0.09), Vector3.ZERO, Color(0.6, 0.65, 0.71), Vector3(90, 0, 0))
	for i in teeth:
		var t := TAU * i / teeth
		_part(g, _box(0.05, 0.05, 0.09), Vector3(cos(t) * (r + 0.02), sin(t) * (r + 0.02), 0),
			Color(0.72, 0.76, 0.81))
	return g

func _pump(parent: Node3D, pos: Vector3) -> void:
	var g := Node3D.new(); g.position = pos; parent.add_child(g)
	_shell(g, _cyl(0.13, 0.34), Vector3.ZERO, Color(0.24, 0.28, 0.33))
	piston = _part(g, _cyl(0.09, 0.16), Vector3.ZERO, Color(0.89, 0.91, 0.94))
	_part(g, _cyl(0.07, 0.12), Vector3(0, -0.22, 0), PAINT)

func _lead_screw(parent: Node3D) -> Node3D:
	var g := Node3D.new(); parent.add_child(g)
	_part(g, _cyl(0.05, 1.4), Vector3.ZERO, Color(0.87, 0.89, 0.93))
	for i in 20:
		_part(g, _torus(0.055, 0.012), Vector3(0, -0.66 + i * 0.07, 0), Color(0.68, 0.72, 0.77), Vector3(90, 0, 0))
	return g

# ---- coverage wall -----------------------------------------------------------
func _build_wall() -> void:
	# boustrophedon order
	for r in ROWS:
		var cs := range(COLS) if r % 2 == 0 else range(COLS - 1, -1, -1)
		for c in cs:
			order.append(Vector2i(c, r))
	var wall := Node3D.new(); wall.position = Vector3(0, 1.4, -1.15); add_child(wall)
	var bg := MeshInstance3D.new()
	var pm := PlaneMesh.new(); pm.size = Vector2(3.7, 2.5)
	bg.mesh = pm; bg.rotation_degrees = Vector3(0, 0, 0)
	bg.material_override = _mat(Color(0.93, 0.945, 0.96), 0.0, 0.95)
	wall.add_child(bg)
	var cw := 3.6 / COLS; var ch := 2.4 / ROWS
	for cell in order:
		var q := MeshInstance3D.new()
		var qm := QuadMesh.new(); qm.size = Vector2(cw * 0.98, ch * 0.98)
		q.mesh = qm
		q.position = Vector3(-1.8 + cw * (cell.x + 0.5), -1.2 + ch * (cell.y + 0.5), 0.01)
		q.material_override = _mat(PAINT, 0.0, 0.7)
		q.visible = false
		wall.add_child(q)
		wall_cells.append(q)

func _advance_coverage(dt: float) -> void:
	var total := COLS * ROWS
	painted = min(total, painted + dt * 6.0)
	var idx := int(painted)
	for i in min(idx, wall_cells.size()):
		wall_cells[i].visible = true
	# aim the head at the active cell
	if idx < order.size() and head:
		var cell := order[idx]
		var tx := -1.8 + (3.6 / COLS) * (cell.x + 0.5)
		var ty := 1.4 + (-1.2 + (2.4 / ROWS) * (cell.y + 0.5))
		head.rotation.y = atan2(tx, 1.0) * 0.6
		head.rotation.x = -atan2(ty - 1.9, 1.0) * 0.5
	if painted >= total:
		painted = 0.0
		for c in wall_cells: c.visible = false

# ---- cameras -----------------------------------------------------------------
func _build_cameras() -> void:
	var presets := [
		{ "pos": Vector3(3.4, 2.3, 3.8), "look": Vector3(0, 1.1, 0) },   # overview
		{ "pos": Vector3(0.9, 2.0, 1.4), "look": Vector3(0, 1.9, 0.2) }, # head close-up
		{ "pos": Vector3(1.6, 0.7, 1.6), "look": Vector3(0, 0.3, 0) },   # base internals
		{ "pos": Vector3(2.6, 3.0, -2.6), "look": Vector3(0, 1.2, -1.0) },# wall / coverage
	]
	for p in presets:
		var c := Camera3D.new()
		c.position = p.pos
		c.look_at_from_position(p.pos, p.look, Vector3.UP)
		c.fov = 42
		c.current = false
		add_child(c)
		cameras.append(c)
	cameras[0].current = true

func _next_camera() -> void:
	cameras[cam_index].current = false
	cam_index = (cam_index + 1) % cameras.size()
	cameras[cam_index].current = true

# ---- HUD ---------------------------------------------------------------------
func _build_hud() -> void:
	var cl := CanvasLayer.new(); add_child(cl)
	hud = Label.new()
	hud.position = Vector2(16, 12)
	hud.add_theme_color_override("font_color", Color.WHITE)
	cl.add_child(hud)

func _update_hud() -> void:
	if not hud: return
	var mode := "cutaway" if cutaway else ("exploded" if exploded else "assembled")
	hud.text = "PaintForge Pro Simulator — CONCEPT (all values are targets)\n"
	hud.text += "view: %s   %s   %s\n" % [mode, "running" if running else "paused", "slow-mo" if slowmo else "1x"]
	hud.text += "coverage: %d%%\n" % int(painted / (COLS * ROWS) * 100.0)
	if job.size() > 0:
		hud.text += "job: %s\n" % str(job)
	hud.text += "[P]run  [C]cutaway  [X]explode  [Z]slow-mo  [Space]camera"

# ---- toggles -----------------------------------------------------------------
func _set_cutaway(v: bool) -> void:
	cutaway = v
	for b in cut_boxes:
		b.visible = v

# ---- job params (web query string OR desktop CLI) ----------------------------
func _read_job() -> Dictionary:
	var out := {}
	# Web export: read window.location.search via the JS bridge.
	if OS.has_feature("web") and JavaScriptBridge:
		var search: String = str(JavaScriptBridge.eval("window.location.search", true))
		if search.begins_with("?"):
			for pair in search.substr(1).split("&"):
				var kv := pair.split("=")
				if kv.size() == 2:
					out[kv[0]] = kv[1].uri_decode()
	# Desktop: --job "sqft=8400&coats=3&surface=wall"
	for a in OS.get_cmdline_args():
		if a.begins_with("--job="):
			for pair in a.substr(6).split("&"):
				var kv := pair.split("=")
				if kv.size() == 2:
					out[kv[0]] = kv[1]
	return out

func _apply_job() -> void:
	# Hook: scale wall to sqft, set coats/passes, preselect robot, etc.
	# Kept honest — only affects the concept sim, never claims a real run.
	if job.has("surface") and job["surface"] == "ceiling":
		pass # e.g. re-target the head pitch for overhead work

# ---- tiny mesh/material helpers ---------------------------------------------
func _mat(col: Color, metal: float, rough: float) -> StandardMaterial3D:
	var m := StandardMaterial3D.new()
	m.albedo_color = col
	m.metallic = metal
	m.roughness = rough
	return m

func _part(parent: Node3D, mesh_res, pos: Vector3, col: Color, rot := Vector3.ZERO) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	mi.mesh = mesh_res
	mi.position = pos
	mi.rotation_degrees = rot
	mi.material_override = _mat(col, 0.9, 0.35)
	parent.add_child(mi)
	return mi

func _explode(node: Node3D, solid: Vector3, blown: Vector3) -> void:
	explode_targets.append({ "node": node, "solid": solid, "blown": blown })

func _box(x: float, y: float, z: float) -> BoxMesh:
	var m := BoxMesh.new(); m.size = Vector3(x, y, z); return m
func _cyl(r: float, h: float) -> CylinderMesh:
	var m := CylinderMesh.new(); m.top_radius = r; m.bottom_radius = r; m.height = h; return m
func _cone(r: float, h: float) -> CylinderMesh:
	var m := CylinderMesh.new(); m.top_radius = 0.0; m.bottom_radius = r; m.height = h; return m
func _torus(inner: float, tube: float) -> TorusMesh:
	var m := TorusMesh.new(); m.inner_radius = inner; m.outer_radius = inner + tube; return m
