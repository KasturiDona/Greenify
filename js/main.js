var app = app || {};
var sunAdded = false;

app.animate = function () {
	requestAnimationFrame( app.animate );

	app.selectedObject = app.scene.getObjectByName("the_sun");

	if ( sunAdded && app.selectedObject ) {
		app.selectedObject.rotation.z += 0.005;
	}
	app.animateRain();
	app.renderer.render( app.scene, app.camera );
};

app.animateRain = function () {
	if (app.raining) {
		// requestAnimationFrame( app.animateRain );
		if ( app.particleSystem.position.y <= -135 ) {
			app.particleSystem.position.y = 0;
		}
		app.particleSystem.position.y -= 0.5;

		app.selectedObject = app.scene.getObjectByName("plant");
		if ( app.selectedObject ) {
			app.selectedObject.scale.y += 0.001;
		}
	} else {
		for ( var i = app.scene.children.length - 1; i >= 0 ; i-- ) {
            var obj = app.scene.children[ i ];

            if ( obj.name && obj.name === "Rain" ){
            	app.scene.remove( obj );
    		}
        }
	}
};

app.addEventHandlers = function () {
	window.addEventListener("mousemove", function() {
		// app.cube.position.x = event.clientX - ( app.width / 2 );
		// app.cube.position.y = ( event.clientY - ( app.height / 2 ) ) * -1;

	});

	window.addEventListener("resize", function() {
		app.width = window.innerWidth;
		app.height = window.innerHeight;
		app.camera.aspect = app.width / app.height;

		app.camera.updateProjectionMatrix();

		app.renderer.setSize( app.width, app.height );
	});

	$('#rain').on('click', function () {
		var selectedObject = app.scene.getObjectByName( "the_sun" );	
		app.scene.remove( selectedObject );
		app.addRain( true );
	});

	$('#stop_rain').on('click', function () {
		var selectedObject = app.scene.getObjectByName( "the_sun" );
		if ( !selectedObject ) {
			app.addSun();
			selectedObject = app.scene.getObjectByName( "the_sun" );
		}
		app.scene.remove( app.rainGroup );
		app.raining = false;
		app.addRain( false );
	});

	$('#seed').on('click', function () {
		app.addPlant();
	});

};

app.addSun = function () {
	sunAdded = true;
	var loader = new THREE.ObjectLoader();
	loader.load('/assets/sun.json', function( object ) {
		object.name = "the_sun";
		object.position.set( 120, 60, 5 );
		object.scale.x = 16;
		object.scale.y = 16;

		app.scene.add( object );
	});

	app.renderer.render( app.scene, app.camera );
	app.animate();
};

app.addPlant = function () {

	app.quaterWidth = Math.round( app.width / 30 );

	app.group = new THREE.Object3D();
	app.group.name = "Plant_group";

	var loader = new THREE.ObjectLoader();
	loader.load('/assets/grass_plant.json', function( object ) {
		object.name = "plant";
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.specular = new THREE.Color( 0x00ff00 );
				child.material.emissive = new THREE.Color( 0x006600 );
				child.material.color.setHex( 0x00FF00 );
				child.material.color.setRGB( 0, 1, 0 );
				child.material.color = new THREE.Color( "rgb(0, 1, 0)" );
			}

			for ( var i = 0; i <= app.width; i += app.quarterWidth ) {
		      for ( var j = 0; j <= app.height; j += 8 ) {
		        var instance = child.clone();
		        instance.position.set( i / 2, j, 0 );
		        app.group.add( instance );
		      }
		    }
		});

		app.group.position.x -= 50;
		app.scene.add( object );
	});
};

// app.addWaterDrop = function (execute) {
	
// 	app.raining = execute;

// 	app.group = new THREE.Object3D();
// 	app.group.name = "Rain";
// 	var loader = new THREE.JSONLoader();
// 	app.quarterWidth = Math.round( app.width / 30 );

//   	loader.load( "/assets/rain_drop.json", function( geometry ){
//     var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
//     var mesh = new THREE.Mesh( geometry, material );
//     for ( var i = 0; i <= app.width; i += app.quarterWidth ) {
//       for ( var j = 0; j <= app.height; j += 8 ) {
//         var instance = mesh.clone();
//         instance.position.set( i / 2, j, 0 );
//         app.group.add( instance );
//       }
//     }
//   });
//   app.group.position.x -= 150;
//   app.scene.add( app.group );
//   app.animateRain();

// };

app.addRain = function ( execute ) {
	app.raining = execute;

	app.rainGroup = app.rainGroup || new THREE.Object3D();
	app.rainGroup.name = "Rain";

	app.particles = new THREE.SphereGeometry();
	app.quarterWidth = Math.round( app.width / 30 );

	for (var p = 0; p <= 2000; p++) {
    	var particle = new THREE.Vector3( Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250 );
    	app.particles.vertices.push( particle );
	}

	app.particleTexture = THREE.ImageUtils.loadTexture( "/assets/raindrop.png" );
	app.particleMaterial = new THREE.PointsMaterial({ map: app.particleTexture, transparent: true, size: 5 });
	app.particleSystem = new THREE.Points(app.particles, app.particleMaterial);

	app.scene.add( app.particleSystem );
	app.particleSystem.name = "Rain";
	app.animateRain();
};


app.init = function () {
	console.log( "page is loaded" );
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

	// var light = new THREE.AmbientLight( 0x0000ff ); 
	// app.scene.add( light );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
	directionalLight.position.set( 120, 60, 0 );
	app.scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
	directionalLight.position.set( 1000, 1, +1000 );
	app.scene.add( directionalLight );

	// var directionalLight = new THREE.DirectionalLight( 0x00ff00, 1);
	// directionalLight.position.set( 1000, 1, -1000 );
	// app.scene.add( directionalLight );

	// var directionalLight = new THREE.DirectionalLight( 0x00ff00, 1);
	// directionalLight.position.set( 0, 1, -1000 );
	// app.scene.add( directionalLight );

	var light = new THREE.HemisphereLight( 0x00ff00, 0xffffff, 1 );
	app.scene.add( light );

	app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );

	app.renderer.render( app.scene, app.camera );
	app.addSun();

	app.addEventHandlers();
};

window.onload = app.init; // $(document).ready();