var app = app || {};

app.animate = function () {
	requestAnimationFrame( app.animate );
	app.cube.rotation.x += 0.05;
	// app.cube.scale.y += 0.02;
	app.cube.rotation.y += 0.05;
	app.renderer.render( app.scene, app.camera );
};

app.addEventHandlers = function () {
	window.addEventListener("mousemove", function() {
		app.cube.position.x = event.clientX - ( app.width / 2 );
		app.cube.position.y = ( event.clientY - ( app.height / 2 ) ) * -1;
	});

	window.addEventListener("resize", function() {
		app.width = window.innerWidth;
		app.height = window.innerHeight;
		app.camera.aspect = app.width / app.height;

		app.camera.updateProjectionMatrix();

		app.renderer.setSize( app.width, app.height );
	});

};

app.addCircle = function () {
	var circleShape = new THREE.SphereGeometry( 50, 16, 16 );
	var material = new THREE.MeshBasicMaterial({ color: 0xEC407A, wireframe: true });
	app.sphere = new THREE.Mesh( circleShape, material );
	app.scene.add( app.sphere );

};

app.addBox = function () {
	console.log( "add box called" );

	var boxShape = new THREE.BoxGeometry( 20, 20, 20 );
	var material = new THREE.MeshBasicMaterial({ color: 0x1A237E, wireframe: true });
	app.cube = new THREE.Mesh( boxShape, material );
	app.scene.add( app.cube );

	app.renderer.render( app.scene, app.camera );

	app.addCircle();
	app.animate();
};

app.init = function () {
	console.log("page is loaded");
	app.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

	app.camera.position.z = 200;
	app.scene = new THREE.Scene();
	app.scene.add( app.camera );

	app.width = window.innerWidth; // $(window).width();
	app.height = window.innerHeight;

	app.renderer = new THREE.WebGLRenderer();
	app.renderer.setSize( app.width, app.height );
	app.renderer.setClearColor( 0xE3F2FD, 1 ); // background color in hex and opacity

	console.log( app.renderer );
	document.body.appendChild( app.renderer.domElement );

	app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );

	app.renderer.render( app.scene, app.camera );
	app.addBox();

	app.addEventHandlers();
};

window.onload = app.init; // $(document).ready();