// Initializing the app
var app = app || {};
var sunAdded = false;
var cloudAdded = false;
var birdAdded = false;

// The app.animate function is called the first time when the page is rendered
app.animate = function () {
	requestAnimationFrame( app.animate );
	// This function is used to move the sun around its z-axis
	app.selectedObject = app.scene.getObjectByName("the_sun");
	if ( sunAdded && app.selectedObject ) {
		app.selectedObject.rotation.z += 0.005;
	}
	app.animateRain();
	app.animateClouds();
	app.animateBirds();
	app.renderer.render( app.scene, app.camera );
};

// This function is used to move the birds around
app.animateBirds = function () {
	// the x and y co-ordinates for the bee is changed
	if( app.meshBee.position.x >= app.width / 4 ) {
		app.meshBee.position.x =-120;
	}
	app.meshBee.position.x += 0.05;

	if( app.meshBee.position.y >= app.height / 10 ) {
		app.meshBee.position.y = 0;
	}
	app.meshBee.position.y += 0.05;

	// the x and y co-ordinates for the butterfly1 is changed
	if( app.meshButterfly1.position.x >= app.width / 4 ) {
		app.meshButterfly1.position.x = -120;
	}
	app.meshButterfly1.position.x += 0.05;

	if( app.meshButterfly1.position.y >= app.height / 10 ) {
		app.meshButterfly1.position.y = 0;
	}
	app.meshButterfly1.position.y += 0.05;

	// the x and y co-ordinates for the butterfly2 is changed
	if( app.meshButterfly2.position.x <= -(app.width / 4) ) {
		app.meshButterfly2.position.x = 120;
	}
	app.meshButterfly2.position.x -= 0.05;

	if( app.meshButterfly2.position.y >= app.height / 10 ) {
		app.meshButterfly2.position.y = 0;
	}
	app.meshButterfly2.position.y += 0.05;
};

// This function is used to move the clouds around
app.animateClouds = function () {
	if( app.meshClouds.position.x >= app.width / 4 ) {
		app.meshClouds.position.x =-120;
	}
	app.meshClouds.position.x += 0.05;

	if( app.meshClouds_copy.position.x >= app.width / 4 ) {
		app.meshClouds_copy.position.x = -120;
	}
	app.meshClouds_copy.position.x += 0.05;
};

app.animateRain = function () {
	if (app.raining) {
		// If raining is true, the rain is made to fall continuously
		if ( app.particleSystem.position.y <= -135 ) {
			app.particleSystem.position.y = 0;
		}
		app.particleSystem.position.y -= 0.7;

		app.selectedObject = app.scene.getObjectByName("plant_group");
		if ( app.selectedObject ) {
			// app.selectedObject.scale.y += 0.001;

			// app.allPlants = [];
			// for (var i = 0; i < app.scene.children; i++ ) {
			// 	var child = app.scene.children[i];
			// 	if ( child.name === "plant_group" ) {
			// 		app.allPlants.push( child )
			// 	}
			// }

			// for (var i = 0; i < app.allPlants; i++) {
			// 	var plant = app.allPlants[i];
			// 	plant.scale.y += 0.001;
			// }

			// Each of the plants ( cloned ones too ), are made to grow by scaling their y axis
			app.allPlants = _.filter( app.scene.children, function (child) {  return child.name === "plant_group" });
			_.each(app.allPlants, function (plant) {
				plant.scale.y += 0.005;
			});
		}

		// Each of the flowers ( cloned ones too ), are made to grow by scaling their x and y axis
		app.flowerObject = app.scene.getObjectByName("flower_group");
		if ( app.flowerObject ) {
			app.allFlowers = _.filter( app.scene.children, function (child) { return child.name === "flower_group" });
			_.each(app.allFlowers, function (flower) {
				flower.scale.y += 0.005;
				flower.scale.x += 0.003;
			});	
		}
	// If raining is flase, i.e it stopped raining, all rain objects from the scene are removed
	} else {
		for ( var i = app.scene.children.length - 1; i >= 0 ; i-- ) {
            var obj = app.scene.children[ i ];

            if ( obj.name && obj.name === "Rain" ){
            	app.scene.remove( obj );
    		}
        }
	}
};

// Called when the app is initialized
app.addEventHandlers = function () {
	
	// resizes objects on the window and updates the projection matrix of the camera accordingly
	window.addEventListener("resize", function() {
		app.width = window.innerWidth;
		app.height = window.innerHeight;
		app.camera.aspect = app.width / app.height;

		app.camera.updateProjectionMatrix();

		// Re-renders the scene with the new size
		app.renderer.setSize( app.width, app.height );
	});

	// When the rain button is clicked, the stop rain button is displayed, the sun, bee and butterflies are removed, and the animate rain function is called
	$('#rain').on('click', function () {
		$('#stop_rain').show();
		var selectedObject = app.scene.getObjectByName( "the_sun" );	
		app.scene.remove( selectedObject );
		app.scene.remove( app.meshButterfly1 );
		app.scene.remove( app.meshButterfly2 );
		app.scene.remove( app.meshBee );
		app.addRain( true );
		$('#rain').hide();
	});

	// When the stop rain button is clicked, the sun, bee and butterflies are added back to the scene, the addRain function is called with the false argument which is used to stop the rain
	$('#stop_rain').on('click', function () {
		$('#rain').show();
		var selectedObject = app.scene.getObjectByName( "the_sun" );
		if ( !selectedObject ) {
			app.addSun();
			selectedObject = app.scene.getObjectByName( "the_sun" );
		}
		app.scene.remove( app.rainGroup );
		app.scene.add( app.meshButterfly1 );
		app.scene.add( app.meshButterfly2 );
		app.scene.add( app.meshBee );
		app.raining = false;
		app.addRain( false );
		$('#stop_rain').hide();
	});

	// This button when clicked, calls the addFlower function which plants the seeds
	$('#seed').on('click', function () {
		app.addFlower();
	});

	// Reloads the page
	$('#refresh').on('click', function () {
		location.reload();
	});

};

// This is called when the app is initialized
app.addSun = function () {
	// So that the sun is not re-rendered multiple times on the screen
	sunAdded = true;

	// Loads the JSON file 
	var loader = new THREE.ObjectLoader();
	loader.load('assets/sun.json', function( object ) {
		object.name = "the_sun";

		// sets the positing and scaling factor for the sun
		object.position.set( 120, 60, 5 );
		object.scale.x = 16;
		object.scale.y = 16;

		app.scene.add( object );
	});

	// Renders the grass-plant, adds the clouds and birds if not already added
	app.renderer.render( app.scene, app.camera );
	app.addPlant();

	if ( !cloudAdded ) {
		app.addClouds();
	}
	if ( !birdAdded ) {
		app.addBirds();
	}

	// calls the animate function
	app.animate();
};

// called by the addSun function and adds the cloud if not already added on the scene
app.addClouds = function () {
	cloudAdded = true;

	// Three Plane geomerty implemented to wrap the png image aroud it
	app.geometry = new THREE.PlaneGeometry(200, 50);
	app.clouds = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("assets/cloud3.png"), transparent: true });
	app.meshClouds = new THREE.Mesh( app.geometry, app.clouds );

	// Sets position and scales the cloud geometry and adds it to the scene
	app.meshClouds.scale.multiplyScalar(0.5);
	app.meshClouds.position.z += 0;
	app.meshClouds.position.x += -90;
	app.meshClouds.position.y += 40;
	app.scene.add( app.meshClouds );

	// Creates a clone of the cloud and adds it to the scene too
	app.meshClouds_copy = app.meshClouds.clone();
	app.meshClouds_copy.position.z += 0;
	app.meshClouds_copy.position.x += 90;
	app.meshClouds_copy.position.y += 30;
	app.scene.add( app.meshClouds_copy );

};

// called by the addSun function and adds the bee, 2 butterflies if not already added on the scene
app.addBirds = function () {
	birdAdded = true;

	// Three Plane geomerty implemented to wrap the png image aroud it.
	app.geometry = new THREE.PlaneGeometry(50, 50);
	app.bee = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("assets/bee1.png"), transparent: true });

	// Sets position and scales the geometry and adds it to the scene. This is repeated for the butterfles too. They are all added at different locations
	app.meshBee = new THREE.Mesh( app.geometry, app.bee );
	app.meshBee.scale.multiplyScalar(0.25);
	// app.meshBee.position.z += 0;
	app.meshBee.position.x += -90;
	app.meshBee.position.y += -10;
	app.scene.add( app.meshBee );

	app.geometry = new THREE.PlaneGeometry(50, 50);
	app.butterfly1 = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("assets/butterfly1.png"), transparent: true });
	app.meshButterfly1 = new THREE.Mesh( app.geometry, app.butterfly1 );
	app.meshButterfly1.scale.multiplyScalar(0.25);
	app.meshButterfly1.position.z += 0;
	app.meshButterfly1.position.x += 0;
	app.meshButterfly1.position.y -= 15;
	app.scene.add( app.meshButterfly1 );

	app.geometry = new THREE.PlaneGeometry(50, 50);
	app.butterfly2 = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("assets/butterfly2.png"), transparent: true });
	app.meshButterfly2 = new THREE.Mesh( app.geometry, app.butterfly2 );
	app.meshButterfly2.scale.multiplyScalar(0.25);
	app.meshButterfly2.position.z += 0;
	app.meshButterfly2.position.x += -20;
	app.meshButterfly2.position.y -= 5;
	app.scene.add( app.meshButterfly2 );
};

// called when the seed button is clicked
app.addFlower = function () {
	// calculates width of the flower bed
	app.quaterWidth = Math.round( app.width / 30 );

	// creates a new 3D object
	app.flower = new THREE.Object3D();
	app.flower.name = "flower_group";

	// loads the JSON file and modifies its color and adds it to the scene
	var loader = new THREE.ObjectLoader();
	loader.load('assets/flower.json', function( object ) {
		try {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
	               	app.flower.add( child );
	               	child.material.specular = new THREE.Color( 0x00ff00 );
					child.material.emissive = new THREE.Color( 0xffff00 );
					child.material.color.setHex( 0x00FF00 );
					child.material.color.setRGB( 0, 1, 0 );
					child.material.color = new THREE.Color( "rgb(0, 1, 0)" );
				}
			});
		} catch (error) {}
		// clones the flower multiple times and adds all the cloned copies to the sceen too at specific positions
		app.scene.add( app.flower );
		for ( var i = -(app.width); i <= app.width; i += 50 ) {
			for ( var j = 0; j <= app.width / 10; j += 10 ) {
			app.flower_copy = app.flower.clone();
			app.flower_copy.name = "flower_group";
			app.flower_copy.position.set( i / 5, -j, 0 );

			app.scene.add( app.flower_copy );

			}	
		}
	});
};

// Adds the lawn
app.addPlant = function () {
	// calculating the width of the grass-plant lawn
	app.quaterWidth = Math.round( app.width / 30 );

	// new 3D object is created
	app.plant = new THREE.Object3D();
	app.plant.name = "plant_group";

	// the JSON file (plant image) loaded
	var loader = new THREE.ObjectLoader();
	loader.load('assets/grass_plant.json', function( object ) {
		object.name = "plant";
		try {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					// setting the specular and emissive ( replaces ambient ) lights for the lambert material
					child.material.specular = new THREE.Color( 0x00ff00 );
					child.material.emissive = new THREE.Color( 0x006600 );
					child.material.color.setHex( 0x00FF00 );
					child.material.color.setRGB( 0, 1, 0 );
					child.material.color = new THREE.Color( "rgb(0, 1, 0)" );

					// sets scaling and rotates the mesh material and adds it to the plant object
					child.scale.set( 0.125, 0.125, 0.125 );
					child.rotation.x = -90;
	               	app.plant.add( child );
				}
			});
		} catch (error) {}
		// adds the plant to the scene and clones it multiple times and adds all the cloned copies to the sceen too at specific positions
		app.scene.add( app.plant );
		for ( var i = -(app.width); i <= app.width; i += 10 ) {
			for ( var j = 0; j <= app.width / 6; j += 6 ) {
			app.plant_copy = app.plant.clone();
			app.plant_copy.name = "plant_group";
			app.plant_copy.position.set( i / 2, -j, 0 );

			app.scene.add( app.plant_copy );

			}
			
		}
	});
};

// When the rain button is clicked, this function is called
app.addRain = function ( execute ) {
	app.raining = execute;

	// Creates a new rain group if not already created
	app.rainGroup = app.rainGroup || new THREE.Object3D();
	app.rainGroup.name = "Rain";

	// Sphere and point goemetries are implemented to generate 2000 particles of variyong sizes
	app.particles = new THREE.SphereGeometry();
	app.quarterWidth = Math.round( app.width / 30 );

	for (var p = 0; p <= 2000; p++) {
		// random generation of x, y, z axis for each particle. Joining these vertices generate random sizes for the particles which are added as spherical objects
    	var particle = new THREE.Vector3( Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250 );
    	app.particles.vertices.push( particle );
	}

	// Wrapping the raindrop png over each particle
	app.particleTexture = THREE.ImageUtils.loadTexture( "assets/raindrop.png" );
	app.particleMaterial = new THREE.PointsMaterial({ map: app.particleTexture, transparent: true, size: 5 });
	app.particleSystem = new THREE.Points(app.particles, app.particleMaterial);

	// adding rain into the scene and calling animate rain function
	app.scene.add( app.particleSystem );
	app.particleSystem.name = "Rain";
	app.animateRain();
};

// Initializes the app
app.init = function () {
	// Adds the camers with z position, aspect ratio, visibility distances
	app.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
	app.camera.position.z = 200;

	// creates a new scene and adds the camera to it
	app.scene = new THREE.Scene();
	app.scene.add( app.camera );

	app.width = window.innerWidth; // $(window).width();
	app.height = window.innerHeight;

	// Renderes the WebGL. This allows for 3D animations
	app.renderer = new THREE.WebGLRenderer();
	app.renderer.setSize( app.width, app.height );
	app.renderer.setClearColor( 0xE3F2FD, 1 ); // background color in hex and opacity

	// appends the WebGL renderer to the dom element
	console.log( app.renderer );
	document.body.appendChild( app.renderer.domElement );

	// Sets the ambient, directional and hemisphere lights

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

	// Orbit controls added
	app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );
	app.renderer.render( app.scene, app.camera );

	// addSun function is called along with hiding the stop rain button and initializng the event handlers
	app.addSun();
	$('#stop_rain').hide();
	app.addEventHandlers();
};

// On document ready only the home page is displayed
$(document).ready( function () {
	$('.container').hide();
	$('.home').show();

	// When clicked, it loads the app and initializes it
	$('#play').on('click', function () {
		$('.container').show();
		$('.home').hide();
		app.init();
	});
});
