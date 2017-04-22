$(document).ready(function(){

  $.ajax({
    url: 'projects.json',
    type: 'GET',
    success: function(data){
      var projects = data;
      /* Populating works list */
      var listing_template = $('#works-list').html();
      var listing_html = Mustache.to_html(listing_template, {projects: projects});
      $('.works-list').html(listing_html);

      /* Populating Previews */
      var preview_template = $('#preview-template').html();
      var preview_html = Mustache.to_html(preview_template, {projects: projects});
      $('.work-preview').prepend(preview_html);
    }
  });

  /* Open/Close navigation menu */
  $('.nav-icon').on('click', 'a.hamburger', function(e){
    e.preventDefault();
    $(this).toggleClass('open');
    $('.nav-icon').toggleClass('open');
    $('.logo-container').toggleClass('behind')

    if( !$('.nav-container').hasClass('open') ){
      $('.nav-container').toggleClass('open transition');
    }else {
      $('.nav-container').removeClass('open');
      setTimeout(function(){
        $('.nav-container').removeClass('transition');
      }, 600);
    }
  });

  /* ityped initialization*/
  ityped.init('.greeting-text .job', {
    strings: ['Web Developer.', 'Wordpress Lover.', 'Gamer.', 'Freelancer.', 'Web Designer.'],
    typeSpeed: 80,
    backSpeed: 80,
    startDelay: 100,
    backDelay: 1000,
    loop: true,
  });


  $('.nav').on('click', 'li a', function(e){
    e.preventDefault();
    var id = $(this).attr('href');
    $('.section:visible').fadeOut(1000, function(){
      $('.works-listing').show();
      $('.work-preview').hide();
      $(id).fadeIn(1000);
    });
    $('.nav-icon a.hamburger').trigger('click');
  });

  $('.works-listing').on('click', '.works-list li a', function(e){
    e.preventDefault();
    var project_id = $(this).data('project-id');
    $('.works-listing').fadeOut(1000, function(){
      $('.work-preview .single-preview').hide();
      $('.work-preview .single-preview[data-project-id="'+ project_id +'"]').css('display', 'inline-block');
      $('.work-preview').fadeIn(1000);
    });
  });

  $('.work-preview').on('click', '.close-preview', function(e){
    e.preventDefault();
    $('.work-preview').fadeOut(1000, function(){
      $('.works-listing').fadeIn(1000);
    });
  })

  
});



let Easing = {
  /* t: current time, b: begInnIng value, c: change In value, d: duration */
  linear: function(t, b, c, d){
    return (c / d * t) + b;
  },
  easeInOutQuad: function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInOutElastic: function(t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
  },
  easeInOutCubic: function(t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  }
};
let Animation = function(){
	let self = this;
  self.camera_distance_z = 60;
  self.vFOV = 70;
  self.camera_near = 0.01;
  self.camera_far = 10000;
  self.add_axis = false;
  self.add_grid = false;
  self.add_orbit_controls = false;

  self.sphere_colors = [ [ 'FFFF00', 'FF0000' ],
          [ 'FF00FF', 'FF0000' ],
          [ 'FFFF00', '00FF00' ],
          [ '00FFFF', '00FF00' ],
          [ '00FFFF', '0000FF' ],
          [ 'FF00FF', '0000FF' ] ];
  
  self.window_width = window.innerWidth;
  self.window_height = window.innerHeight;
  self.aspect = self.window_width / self.window_height;
  
  self.circles = new Array();
  
  self.setupEnvironment();

  self.onResize();
  self.calculateBounds();
  window.addEventListener("resize", self.onResize.bind(self));
  window.addEventListener("orientationchange", self.onResize.bind(self));
  window.addEventListener("resize", self.calculateBounds.bind(self));
  window.addEventListener("orientationchange", self.calculateBounds.bind(self));
};
Animation.prototype.setupEnvironment = function(){
	let self = this;
  self.scene = new THREE.Scene();
  self.camera = new THREE.PerspectiveCamera( self.vFOV, self.aspect, self.camera_near, self.camera_far);
  self.renderer = new THREE.WebGLRenderer();
  self.camera.position.set( 0, 0, self.camera_distance_z );

  self.container = document.getElementById('site-container');
  self.container.insertBefore( self.renderer.domElement, self.container.firstChild );

  if( self.add_axis ){
    self.axis = new THREE.AxisHelper(50);
    self.scene.add( self.axis );
  }

  if( self.add_grid ){
    self.grid = new THREE.GridHelper(50, 10);
    self.scene.add( self.grid );
  }

  if( self.add_orbit_controls ){
    self.controls = new THREE.OrbitControls( self.camera, self.renderer.domElement );
    self.controls.enableZoom = true;
  }
};
Animation.prototype.onResize = function(){
	let self = this;
  self.window_width = window.innerWidth;
  self.window_height = window.innerHeight;
  self.aspect = self.window_width / self.window_height;

  self.camera.aspect = self.aspect;
  self.camera.updateProjectionMatrix();
  self.renderer.setSize( self.window_width, self.window_height );
};
Animation.prototype.calculateBounds = function(){
	var self = this;
  var fov = self.vFOV * Math.PI / 180;  // convert vertical fov to radians
  var height = 2 * Math.tan( fov / 2 ) * self.camera_distance_z; // visible height

  var width = height * self.aspect;

  self.visible_area = {
    min_x: - width / 2,
    max_x: width / 2,
    min_y: - height / 2,
    max_y: height / 2,
  };
};
Animation.prototype.generateCircle = function(){
	let self = this;
  let radius = Math.random() * 3 + 3;
  let geometry = new THREE.CircleGeometry(radius, 128);
  var texture = new THREE.Texture( self.generateTexture() );
  texture.needsUpdate = true; // important!
  
  let material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0 } );
  let circle = new THREE.Mesh( geometry, material );
  let bounds = self.visible_area;
  let x = Math.floor( Math.random() * (bounds.max_x - bounds.min_x + 1) + bounds.min_x );
  let y = Math.floor( Math.random() * (bounds.max_y - bounds.min_y + 1) + bounds.min_y );
  circle.position.set( x, y, 0 );
  circle.rotation.z += Math.random() * 360;

  self.scene.add( circle );
  let object = {
    graphic: circle,
    generated_at: Date.now(),
    lifespan: Math.random() * 3000 + 4000,
    rotation: (Math.random() > 0.5) ? 0.01 * Math.random() * 2 : -0.01 * Math.random() * 2
  }
  self.circles.push( object );
};
Animation.prototype.animateCircles = function(){
	let self = this;
  let time = Date.now();

  for( let i = 0; i < self.circles.length; i++ ){
    let circle = self.circles[i];
    self.renderer.clear();
    let elapsed_time = time - circle.generated_at;
    if( elapsed_time > circle.lifespan ){
      circle.graphic.parent.remove(circle.graphic);
      self.circles.splice(i, 1);
      i--;
      setTimeout(function(){
        self.generateCircle();
      }, Math.random() * 3000);
    }else {
      circle.graphic.rotation.z +=  circle.rotation;
      if( elapsed_time <= circle.lifespan * 3 / 4 ){
        circle.graphic.material.opacity = Easing['easeInOutQuad'](elapsed_time, 0, 0.5, circle.lifespan * 3 / 4);
      }else {
        elapsed_time -= circle.lifespan * 3 / 4;
        circle.graphic.material.opacity = Easing['easeInOutQuad'](elapsed_time, 0.5, -0.5, circle.lifespan / 4);
      }
    }
  }
};
Animation.prototype.generateTexture = function(){
	let self = this;
  var size = 8;
  // create canvas
  canvas = document.createElement( 'canvas' );
  canvas.width = size;
  canvas.height = size;

  // get context
  var context = canvas.getContext( '2d' );

  // draw gradient
  context.rect( 0, 0, size, size );
  var gradient = context.createLinearGradient( 0, 0, size, size );
  let color = self.sphere_colors[Math.floor( Math.random() * self.sphere_colors.length )];
  gradient.addColorStop(0, '#' + color[0]); 
  gradient.addColorStop(0.55, '#' + color[0]); 
  gradient.addColorStop(1, '#' + color[1]); 
  context.fillStyle = gradient;
  context.fill();

  return canvas;
};

let anim = new Animation();
for( let i = 0; i < 50; i++ ){
  setTimeout(function(){
    anim.generateCircle();
  }, Math.random() * 10000);
}
function render(){
  if( anim.add_orbit_controls ){
    anim.controls.update();
  }
  if( anim.circles.length ){
    anim.animateCircles();
  }
  anim.renderer.render( anim.scene, anim.camera );
  requestAnimationFrame( render );
}
render();