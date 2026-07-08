extends Node3D
## PaintForge Pro Simulator — reference-class teardown.
##
## Data-driven over the FIVE industry reference arms shown on /raas and /saas.
## These are STYLIZED representations of third-party robot CLASSES with their
## real published specs — not PaintForge hardware, not vendor-accurate replicas,
## not authorized models. Everything is a concept target.

const ROBOTS := [
	{
		"id":"abb-irb-5500","vendor":"ABB","model":"IRB 5500 FlexPainter",
		"task":"Automotive exterior body","target":"panel",
		"tool":"bell","reach":1.05,"accent":Color(0.894,0.0,0.169),
		"specs":["6 axes","13 kg","0.15 mm","IP66/IP67 ATEX","IRC5P"],
		"note":"Process built into the arm; bell atomizer."
	},
	{
		"id":"fanuc-p-250ib","vendor":"FANUC","model":"P-250iB/15",
		"task":"Automotive body & large parts","target":"largepart",
		"tool":"gun","reach":1.30,"accent":Color(0.95,0.77,0.06),
		"specs":["6 axes","15 kg","2800 mm reach","ATEX Zone 1","R-30iB Plus"],
		"note":"Large 2800 mm envelope, patented hollow wrist."
	},
	{
		"id":"yaskawa-mpx3500","vendor":"YASKAWA","model":"Motoman MPX3500",
		"task":"Automotive body & components","target":"contour",
		"tool":"bell","reach":1.18,"accent":Color(0.13,0.42,0.82),
		"specs":["6 axes","15 kg wrist","2700 mm reach","FM/ATEX","DX200-FM"],
		"note":"70 mm hollow wrist carries large rotary bells."
	},
	{
		"id":"kawasaki-kj264","vendor":"KAWASAKI","model":"KJ264",
		"task":"Automotive body","target":"panel",
		"tool":"gun","reach":1.14,"accent":Color(0.20,0.55,0.32),
		"specs":["6 axes","15 kg","2640 mm reach","Explosion-proof","3R hollow wrist"],
		"note":"3R hollow wrist routes hoses internally."
	},
	{
		"id":"kuka-ready2-spray","vendor":"KUKA + DÜRR","model":"ready2_spray (KR AGILUS EX)",
		"task":"General industry — small parts","target":"smallpart",
		"tool":"gun","reach":0.78,"accent":Color(1.0,0.42,0.21),
		"specs":["6 axes","10 kg","1101 mm reach","0.03 mm","ATEX 3G/3D"],
		"note":"Compact pre-configured cell; Dürr EcoAUC."
	},
]

var idx := 0
var running := true
var cutaway := false
var exploded := false
var slowmo := false

var arm_root: Node3D
var j1: Node3D
var j2: Node3D
var j3: Node3D
var wrist: Node3D
var tool_tip: Node3D
var bell: Node3D
var piston: MeshInstance3D
var rotors: Array[Node3D] = []
var gears: Array[Dictionary] = []
var cut_boxes: Array[CSGBox3D] = []
var explode_targets: Array[Dictionary] = []

var L1 := 1.4
var L2 := 1.2
var shoulder_h := 1.15

const COLS := 14
const ROWS := 8
var order: Array[Vector2i] = []
var cells: Array[MeshInstance3D] = []
var painted := 0.0
var target_root: Node3D
var target_center := Vector3(0,1.4,-1.6)
var target_w := 2.4
var target_h := 1.6

var cameras: Array[Camera3D] = []
var cam_index := 0
var name_lbl: Label
var spec_lbl: Label
var hud: Label

func _ready() -> void:
	_build_environment()
	_build_ui()
	_build_cameras()
	_load_robot(_job_robot_index())

func _process(delta: float) -> void:
	var dt := delta * (0.15 if slowmo else 1.0)
	if running:
		for r in rotors: r.rotate_z(10.0 * dt)
		for g in gears: g.node.rotate_z(g.dir * 6.0 * dt)
		if bell: bell.rotate_y(45.0 * dt)
		if piston: piston.position.y = -0.02 + sin(Time.get_ticks_msec()*0.012*(0.15 if slowmo else 1.0))*0.06
		_advance_task(dt)
	for e in explode_targets:
		var goal: Vector3 = e.blown if exploded else e.solid
		e.node.position = e.node.position.lerp(goal, delta*6.0)
	_update_hud()

func _unhandled_input(_e: InputEvent) -> void:
	if Input.is_action_just_pressed("toggle_run"): running = not running
	if Input.is_action_just_pressed("toggle_cutaway"): _set_cutaway(not cutaway)
	if Input.is_action_just_pressed("toggle_explode"): exploded = not exploded
	if Input.is_action_just_pressed("toggle_slowmo"): slowmo = not slowmo
	if Input.is_action_just_pressed("cam_next"): _next_camera()

func _advance_task(dt: float) -> void:
	var total := COLS*ROWS
	painted = min(total, painted + dt*7.0)
	var i := int(painted)
	for k in min(i, cells.size()): cells[k].visible = true
	if i < order.size():
		var c := order[i]
		var wp := _cell_world(c)
		_aim_arm_at(wp)
	if painted >= total:
		painted = 0.0
		for c in cells: c.visible = false

func _cell_world(c: Vector2i) -> Vector3:
	var cw := target_w/COLS; var ch := target_h/ROWS
	return target_center + Vector3(-target_w/2.0 + cw*(c.x+0.5), -target_h/2.0 + ch*(c.y+0.5), 0.0)

func _aim_arm_at(wp: Vector3) -> void:
	var local := wp - arm_root.global_position
	var yaw := atan2(local.x, -local.z)
	if j1: j1.rotation.y = lerp_angle(j1.rotation.y, yaw, 0.25)
	var horiz := Vector2(local.x, local.z).length()
	var d := horiz - 0.25
	var h := wp.y - (arm_root.global_position.y + shoulder_h)
	var r := clampf(sqrt(d*d + h*h), abs(L1-L2)+0.02, L1+L2-0.02)
	var cos_e := clampf((r*r - L1*L1 - L2*L2)/(2.0*L1*L2), -1.0, 1.0)
	var elbow := acos(cos_e)
	var shoulder := atan2(h, d) - atan2(L2*sin(elbow), L1 + L2*cos(elbow))
	if j2: j2.rotation.x = lerp_angle(j2.rotation.x, -shoulder, 0.25)
	if j3: j3.rotation.x = lerp_angle(j3.rotation.x, elbow, 0.25)
	if wrist: wrist.rotation.x = lerp_angle(wrist.rotation.x, shoulder - elbow + 0.2, 0.25)

func _load_robot(new_idx: int) -> void:
	idx = wrapi(new_idx, 0, ROBOTS.size())
	var r: Dictionary = ROBOTS[idx]
	rotors.clear(); gears.clear(); cut_boxes.clear(); explode_targets.clear()
	bell = null; piston = null
	if arm_root: arm_root.queue_free()
	if target_root: target_root.queue_free()
	L1 = 1.35 * r.reach; L2 = 1.15 * r.reach; shoulder_h = 1.0 + 0.15*r.reach
	painted = 0.0
	_build_arm(r)
	_build_target(r)
	_set_cutaway(cutaway)
	name_lbl.text = "%s  %s" % [r.vendor, r.model]
	spec_lbl.text = "%s\nTASK: %s\n%s" % [r.note, r.task, "  ·  ".join(r.specs)]

func _build_arm(r: Dictionary) -> void:
	var accent: Color = r.accent
	arm_root = Node3D.new(); add_child(arm_root)
	_shell(arm_root, _cyl(0.42,0.5), Vector3(0,0.25,0), Color(0.12,0.16,0.22))
	j1 = Node3D.new(); j1.position = Vector3(0,0.5,0); arm_root.add_child(j1)
	_shell(j1, _cyl(0.34,0.4), Vector3(0,0.2,0), accent.darkened(0.35))
	_joint_gears(j1, Vector3(0,0.2,0.0), 0.9)
	_servo(j1, Vector3(0.28,0.2,0))
	j2 = Node3D.new(); j2.position = Vector3(0,0.45,0); j1.add_child(j2)
	_joint_gears(j2, Vector3.ZERO, 1.0)
	_servo(j2, Vector3(0.24,0,0))
	var upper := _shell(j2, _box(0.22,L1,0.22), Vector3(0,L1/2.0,0), Color(0.86,0.88,0.9))
	_explode(upper, upper.position, upper.position + Vector3(0.6,0,0))
	j3 = Node3D.new(); j3.position = Vector3(0,L1,0); j2.add_child(j3)
	_joint_gears(j3, Vector3.ZERO, 0.85)
	_servo(j3, Vector3(0.2,0,0))
	var fore := _shell(j3, _box(0.18,L2,0.18), Vector3(0,L2/2.0,0), Color(0.8,0.82,0.85))
	_explode(fore, fore.position, fore.position + Vector3(-0.5,0,0))
	wrist = Node3D.new(); wrist.position = Vector3(0,L2,0); j3.add_child(wrist)
	_shell(wrist, _cyl(0.12,0.28), Vector3(0,0.1,0), accent)
	_joint_gears(wrist, Vector3(0,0.1,0), 0.5)
	_pump(j2, Vector3(0.22,L1*0.4,0))
	tool_tip = Node3D.new(); tool_tip.position = Vector3(0,0.3,0); wrist.add_child(tool_tip)
	if r.tool == "bell":
		_rotary_bell(tool_tip, accent)
	else:
		_spray_gun(tool_tip, accent)

func _build_target(r: Dictionary) -> void:
	target_root = Node3D.new(); add_child(target_root)
	match r.target:
		"largepart": target_w=3.0; target_h=2.0; target_center=Vector3(0,1.5,-1.9)
		"contour":   target_w=2.2; target_h=1.6; target_center=Vector3(0,1.4,-1.6)
		"smallpart": target_w=1.2; target_h=1.0; target_center=Vector3(0,1.1,-1.1)
		_:           target_w=2.4; target_h=1.6; target_center=Vector3(0,1.4,-1.6)
	var panel := MeshInstance3D.new()
	panel.mesh = _box(target_w+0.2, target_h+0.2, 0.08)
	panel.position = target_center
	panel.material_override = _mat(Color(0.90,0.92,0.94),0.0,0.9)
	target_root.add_child(panel)
	order.clear(); cells.clear()
	for row in ROWS:
		var cs := range(COLS) if row%2==0 else range(COLS-1,-1,-1)
		for col in cs: order.append(Vector2i(col,row))
	var cw := target_w/COLS; var ch := target_h/ROWS
	for cell in order:
		var q := MeshInstance3D.new()
		q.mesh = _box(cw*0.94, ch*0.94, 0.02)
		q.position = _cell_world(cell) + Vector3(0,0,0.06)
		q.material_override = _mat(r.accent.lightened(0.1),0.0,0.6)
		q.visible = false
		target_root.add_child(q); cells.append(q)

func _joint_gears(parent: Node3D, pos: Vector3, s: float) -> void:
	var g := Node3D.new(); g.position = pos; parent.add_child(g)
	_shell(g, _box(0.34*s,0.30*s,0.18*s), Vector3.ZERO, Color(0.24,0.28,0.33))
	gears.append({"node":_gear(g, Vector3(-0.07*s,0,0.10*s), 16, 0.11*s), "dir":1.0})
	gears.append({"node":_gear(g, Vector3(0.08*s,0,0.10*s), 11, 0.08*s), "dir":-1.45})

func _gear(parent: Node3D, pos: Vector3, teeth: int, r: float) -> Node3D:
	var g := Node3D.new(); g.position = pos; parent.add_child(g)
	_part(g, _cyl(r,0.07), Vector3.ZERO, Color(0.62,0.66,0.72), Vector3(90,0,0))
	for i in teeth:
		var t := TAU*i/teeth
		_part(g, _box(0.035,0.035,0.07), Vector3(cos(t)*(r+0.015), sin(t)*(r+0.015), 0), Color(0.74,0.78,0.82))
	return g

func _servo(parent: Node3D, pos: Vector3) -> void:
	var g := Node3D.new(); g.position = pos; parent.add_child(g)
	_shell(g, _cyl(0.11,0.22), Vector3.ZERO, Color(0.34,0.38,0.44), Vector3(90,0,0))
	var rotor := Node3D.new(); g.add_child(rotor)
	_part(rotor, _cyl(0.07,0.24), Vector3.ZERO, Color(0.78,0.48,0.23), Vector3(90,0,0))
	for i in 6:
		var a := TAU*i/6.0
		_part(rotor, _box(0.02,0.22,0.03), Vector3(cos(a)*0.085, sin(a)*0.085, 0), Color(0.22,0.16,0.09), Vector3(90,0,0))
	rotors.append(rotor)

func _pump(parent: Node3D, pos: Vector3) -> void:
	var g := Node3D.new(); g.position = pos; parent.add_child(g)
	_shell(g, _cyl(0.09,0.24), Vector3.ZERO, Color(0.24,0.28,0.33))
	piston = _part(g, _cyl(0.06,0.12), Vector3.ZERO, Color(0.88,0.90,0.93))
	_part(g, _cyl(0.045,0.09), Vector3(0,-0.16,0), Color(0.23,0.49,0.85))
	_explode(g, pos, pos + Vector3(0.4,0,0))

func _rotary_bell(parent: Node3D, accent: Color) -> void:
	_part(parent, _cyl(0.05,0.12), Vector3(0,0,0), Color(0.1,0.12,0.16))
	bell = Node3D.new(); bell.position = Vector3(0,0.11,0); parent.add_child(bell)
	_part(bell, _cone(0.11,0.09), Vector3(0,0.04,0), Color(0.85,0.87,0.9), Vector3(180,0,0))
	_spray_cone(parent, Vector3(0,0.22,0), accent, 0.22)

func _spray_gun(parent: Node3D, accent: Color) -> void:
	_part(parent, _box(0.09,0.16,0.09), Vector3(0,0.02,0), Color(0.12,0.14,0.18))
	_part(parent, _box(0.04,0.06,0.10), Vector3(0,-0.04,0.06), Color(0.2,0.22,0.26))
	_part(parent, _cone(0.035,0.08), Vector3(0,0.12,0), Color(0.05,0.06,0.09))
	_spray_cone(parent, Vector3(0,0.18,0), accent, 0.16)

func _spray_cone(parent: Node3D, pos: Vector3, accent: Color, r: float) -> void:
	var c := MeshInstance3D.new()
	c.mesh = _cone(r, 0.7)
	c.position = pos + Vector3(0,0.35,0)
	var m := _mat(accent, 0.0, 0.4); m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	m.albedo_color.a = 0.12
	c.material_override = m
	parent.add_child(c)

func _shell(parent: Node3D, mesh_res, pos: Vector3, col: Color, rot := Vector3.ZERO) -> CSGCombiner3D:
	var comb := CSGCombiner3D.new(); comb.position = pos; comb.rotation_degrees = rot
	comb.use_collision = false
	var m := CSGMesh3D.new(); m.mesh = mesh_res; m.material = _mat(col,0.6,0.4)
	comb.add_child(m)
	var cut := CSGBox3D.new(); cut.size = Vector3(4,4,4); cut.position = Vector3(2,0,2)
	cut.operation = CSGShape3D.OPERATION_SUBTRACTION; cut.visible = false
	comb.add_child(cut); cut_boxes.append(cut)
	parent.add_child(comb)
	return comb

func _set_cutaway(v: bool) -> void:
	cutaway = v
	for b in cut_boxes: b.visible = v

func _build_environment() -> void:
	var we := WorldEnvironment.new(); var e := Environment.new()
	e.background_mode = Environment.BG_COLOR
	e.background_color = Color(0.039,0.145,0.251)
	e.ambient_light_color = Color(0.35,0.45,0.6); e.ambient_light_energy = 0.6
	we.environment = e; add_child(we)
	var key := DirectionalLight3D.new(); key.rotation_degrees = Vector3(-50,-40,0)
	key.light_energy = 1.9; key.shadow_enabled = true; add_child(key)
	var rim := DirectionalLight3D.new(); rim.rotation_degrees = Vector3(-15,140,0)
	rim.light_color = Color(1.0,0.42,0.21); rim.light_energy = 0.5; add_child(rim)
	var fl := MeshInstance3D.new(); var pm := PlaneMesh.new(); pm.size = Vector2(14,14)
	fl.mesh = pm; fl.material_override = _mat(Color(0.09,0.13,0.2),0.1,0.9); add_child(fl)

func _build_cameras() -> void:
	var presets := [
		{"pos":Vector3(4.2,3.0,4.6),"look":Vector3(0,1.4,-0.4)},
		{"pos":Vector3(1.2,2.4,1.8),"look":Vector3(0,2.2,-0.2)},
		{"pos":Vector3(1.8,1.0,1.6),"look":Vector3(0,0.9,0)},
		{"pos":Vector3(2.8,2.4,-3.2),"look":Vector3(0,1.4,-1.6)},
	]
	for p in presets:
		var c := Camera3D.new(); c.position = p.pos
		c.look_at_from_position(p.pos, p.look, Vector3.UP); c.fov = 44
		add_child(c); cameras.append(c)
	cameras[0].current = true

func _next_camera() -> void:
	cameras[cam_index].current = false
	cam_index = (cam_index+1) % cameras.size()
	cameras[cam_index].current = true

func _build_ui() -> void:
	var cl := CanvasLayer.new(); add_child(cl)
	var panel := PanelContainer.new()
	panel.position = Vector2(14,12); panel.custom_minimum_size = Vector2(430,0)
	cl.add_child(panel)
	var vb := VBoxContainer.new(); vb.add_theme_constant_override("separation",4); panel.add_child(vb)
	var tag := Label.new(); tag.text = "PaintForge Pro Simulator — reference class · concept (targets)"
	tag.add_theme_color_override("font_color", Color(1,0.6,0.35)); vb.add_child(tag)
	name_lbl = Label.new(); name_lbl.add_theme_font_size_override("font_size",20)
	name_lbl.add_theme_color_override("font_color", Color.WHITE); vb.add_child(name_lbl)
	spec_lbl = Label.new(); spec_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	spec_lbl.add_theme_color_override("font_color", Color(0.8,0.86,0.94)); vb.add_child(spec_lbl)
	hud = Label.new(); hud.add_theme_color_override("font_color", Color(0.7,0.78,0.88)); vb.add_child(hud)
	var hb := HBoxContainer.new(); hb.add_theme_constant_override("separation",6); vb.add_child(hb)
	_btn(hb,"◀ Robot", func(): _load_robot(idx-1))
	_btn(hb,"Robot ▶", func(): _load_robot(idx+1))
	_btn(hb,"Run/Pause", func(): running = not running)
	var hb2 := HBoxContainer.new(); hb2.add_theme_constant_override("separation",6); vb.add_child(hb2)
	_btn(hb2,"Cutaway", func(): _set_cutaway(not cutaway))
	_btn(hb2,"Exploded", func(): exploded = not exploded)
	_btn(hb2,"Slow-mo", func(): slowmo = not slowmo)
	_btn(hb2,"Camera", func(): _next_camera())

func _btn(parent: Node, text: String, cb: Callable) -> void:
	var b := Button.new(); b.text = text; b.pressed.connect(cb); parent.add_child(b)

func _update_hud() -> void:
	if not hud: return
	var mode := "cutaway" if cutaway else ("exploded" if exploded else "assembled")
	hud.text = "view: %s   %s   %s   coverage: %d%%\n[C]cutaway [X]explode [Z]slow-mo [Space]camera" % [
		mode, "running" if running else "paused", "0.15x" if slowmo else "1x",
		int(painted/float(COLS*ROWS)*100.0)]

func _job_robot_index() -> int:
	var want := ""
	if OS.has_feature("web") and JavaScriptBridge:
		var s: String = str(JavaScriptBridge.eval("window.location.search", true))
		if s.begins_with("?"):
			for pair in s.substr(1).split("&"):
				var kv := pair.split("=")
				if kv.size()==2 and (kv[0]=="robotId" or kv[0]=="robot"): want = kv[1].uri_decode()
	for a in OS.get_cmdline_args():
		if a.begins_with("--robotId="): want = a.substr(10)
	for i in ROBOTS.size():
		if ROBOTS[i].id == want: return i
	return 0

func _explode(node: Node3D, solid: Vector3, blown: Vector3) -> void:
	explode_targets.append({"node":node,"solid":solid,"blown":blown})

func _mat(col: Color, metal: float, rough: float) -> StandardMaterial3D:
	var m := StandardMaterial3D.new(); m.albedo_color = col; m.metallic = metal; m.roughness = rough
	return m
func _part(parent: Node3D, mesh_res, pos: Vector3, col: Color, rot := Vector3.ZERO) -> MeshInstance3D:
	var mi := MeshInstance3D.new(); mi.mesh = mesh_res; mi.position = pos; mi.rotation_degrees = rot
	mi.material_override = _mat(col,0.9,0.35); parent.add_child(mi); return mi
func _box(x:float,y:float,z:float)->BoxMesh:
	var m:=BoxMesh.new(); m.size=Vector3(x,y,z); return m
func _cyl(r:float,h:float)->CylinderMesh:
	var m:=CylinderMesh.new(); m.top_radius=r; m.bottom_radius=r; m.height=h; return m
func _cone(r:float,h:float)->CylinderMesh:
	var m:=CylinderMesh.new(); m.top_radius=0.0; m.bottom_radius=r; m.height=h; return m
