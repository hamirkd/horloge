
var vertexShader=`#version 300 es
uniform mat4 monortho;
uniform mat4 projectionMatrix;//camera de projection
uniform mat4 viewMatrix;//camera de la matrice
in vec2 point_in;//postion
in vec2 tc; //données textures
out vec2 tc_out;//sortie pour le fragment shader
void main(){
	gl_Position =projectionMatrix*viewMatrix*monortho*vec4(point_in,0,1.0);
	tc_out = tc;
}

`;

var fragmentShader=`#version 300 es
precision highp float;
in vec2 tc_out; //entrée des coordonnées
out vec4 frag_out; // sortie 
uniform sampler2D TU0;// texture en 2D
void main(){
	vec2 tc2 = vec2(tc_out);
	vec3 col = texture(TU0,tc2).rgb;
	
	frag_out = vec4(col,0.0);
//	gl_FragColor = vec4(frag_out); //else gl_FragColor = vec4(0,1,0,1);
}
`;
var prg=null;
var vao=null;
var tex2=null;
var tex3=null;
var tex4=null;
var tex5=null;
//initialisation des données par opengl
function init_wgl(){
	prg=ShaderProgram(vertexShader,fragmentShader,"Texture");//association vertex shader fragment shader
	let vbo=VBO([-1,-1,1,-1,1,1,-1,1],2);//VBO des positions 
	let vbo_tc=VBO([0,1, 1,1, 1,0, 0,0], 2);//VBO des textures

//Liaison des VBO par la technologie VAO (position et textures)
	vao=VAO([prg.in.point_in,vbo],[prg.in.tc,vbo_tc]);
//Initialisation des caméras en radius et centrée
	scene_camera.set_scene_radius(3);
	scene_camera.set_scene_center(Vec3(0,0,0));
//Initialisation des textures ou des images
	tex2 = Texture2d([gl.TEXTURE_WRAP_S,gl.REPEAT],[gl.TEXTURE_WRAP_T,gl.REPEAT]);
	tex3 = Texture2d([gl.TEXTURE_WRAP_S,gl.REPEAT],[gl.TEXTURE_WRAP_T,gl.REPEAT]);
	tex4 = Texture2d([gl.TEXTURE_WRAP_S,gl.REPEAT],[gl.TEXTURE_WRAP_T,gl.REPEAT]);
	tex5 = Texture2d([gl.TEXTURE_WRAP_S,gl.REPEAT],[gl.TEXTURE_WRAP_T,gl.REPEAT]);
	//Récupération des images et affectation
	Promise.all([tex2.load("Traitée2.png")],[tex3.load("TraitéeAiguille2.png")],
		[tex4.load("aiguille2.png")],[tex5.load("roue.png")]).then(update_wgl);
	ewgl_continuous_update = true;
}
//affichage des opengl
function draw_wgl(){
	gl.clearColor(0,0,0,0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //essaie de transparence
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.blendFuncSeparate (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	//constance des caméras et affectation aux matrices
	const projection_matrix = scene_camera.get_projection_matrix();
	const view_matrix = scene_camera.get_view_matrix();
	prg.uniform.projectionMatrix=projection_matrix;
	prg.uniform.viewMatrix=view_matrix;
//liaison des programmes
	prg.bind();
	vao.bind();
	prg.uniform.monortho=ortho2D;

//Multiplications des matrices et affichage

	prg.uniform.viewMatrix = mmult(view_matrix,translate(-0.13,-0.1,0),rotateZ(80*ewgl_current_time),scale(0.2,0.2),translate(0,0,-0.1));
	prg.uniform.TU0 = tex5.bind(0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	prg.uniform.viewMatrix = mmult(view_matrix,translate(0.2,0.1,0),rotateZ(-50*ewgl_current_time),scale(0.2,0.2),translate(0,0,-0.1));
	prg.uniform.TU0 = tex5.bind(0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	prg.uniform.viewMatrix = mmult(view_matrix,translate(-0.13,-0.1,0),rotateZ(60*ewgl_current_time),scale(0.2,0.2),translate(0,0,0.1));
	prg.uniform.TU0 = tex5.bind(0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	prg.uniform.viewMatrix = mmult(view_matrix,translate(0.2,0.1,0),rotateZ(-60*ewgl_current_time),scale(0.2,0.2),translate(0,0,0.1));
	prg.uniform.TU0 = tex5.bind(0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	prg.uniform.viewMatrix = mmult(view_matrix,rotateZ(f_time('m')),scale(0.3,0.1),translate(0.5,0,0.2));
	prg.uniform.TU0 = tex3.bind(0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	prg.uniform.viewMatrix = mmult(view_matrix,translate(0,0,0));
	prg.uniform.TU0 = tex2.bind(0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	prg.uniform.viewMatrix = mmult(view_matrix,rotateZ(f_time('h')),scale(0.2,0.1),translate(0.5,0,0.5));
	prg.uniform.TU0 = tex3.bind(0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

	prg.uniform.viewMatrix = mmult(view_matrix,rotateZ(f_time('s')),scale(0.5,0.01),translate(0.5,0,0.7));
	prg.uniform.TU0 = tex4.bind(0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
//fonction de récupération du temps
function f_time(type){
	let date=new Date();
	switch(type){
		case "h":return 90-30*(date.getHours()+date.getMinutes()/60);
		case "m":return 90-(date.getMinutes()+date.getSeconds()/60)*360/60;
		case "s":return 90-date.getSeconds()*360/60;
	}
	
}
//lancemet du code
launch_3d();