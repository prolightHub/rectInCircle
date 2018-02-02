var canvas = document.getElementById("canvas");
var processing = new Processing(canvas, function(processing) {
    processing.size(400, 400);
    processing.background(0xFFF);

    var mouseIsPressed = false;
    processing.mousePressed = function () { mouseIsPressed = true; };
    processing.mouseReleased = function () { mouseIsPressed = false; };

    var keyIsPressed = false;
    processing.keyPressed = function () { keyIsPressed = true; };
    processing.keyReleased = function () { keyIsPressed = false; };

    function getImage(s) {
        var url = "https://www.kasandbox.org/programming-images/" + s + ".png";
        processing.externals.sketch.imageCache.add(url);
        return processing.loadImage(url);
    }

    function getLocalImage(url) {
        processing.externals.sketch.imageCache.add(url);
        return processing.loadImage(url);
    }

    // use degrees rather than radians in rotate function
    var rotateFn = processing.rotate;
    processing.rotate = function (angle) {
        rotateFn(processing.radians(angle));
    };

    with (processing) {
        var Block = function(xPos, yPos, width, height, colorValue)
        {
            this.xPos = xPos;
            this.yPos = yPos;
            this.width = width;
            this.height = height;
            this.color = colorValue;
            
            this.draw = function()
            {
                fill(this.color);
                rect(this.xPos, this.yPos, this.width, this.height);
            };
        };
        var Circle = function(xPos, yPos, diameter, colorValue)
        {
            this.xPos = xPos;
            this.yPos = yPos;
            this.diameter = diameter;
            this.radius = this.diameter / 2;
            this.color = colorValue;
            
            this.draw = function()
            {
                 fill(this.color);
                 ellipse(this.xPos, this.yPos, this.diameter, this.diameter);
            };
        };
        var block = new Block(140, 300, 40, 60, color(30, 130, 20));
        var circle = new Circle(200, 170, 70, color(30, 130, 20));
        
        var Observer = {
            colliding : function(rect1, circle1)
            {
                var point1 = {};
                rect1.middleXPos = rect1.xPos + rect1.width / 2;
                rect1.middleYPos = rect1.yPos + rect1.height / 2;
                rect1.halfLineThrough = dist(rect1.xPos, rect1.yPos, rect1.xPos + rect1.width, rect1.yPos + rect1.height) / 2;
                    
                //Step 1 : Get the closest point on the circle on the rectangle to the circle
                var angle = atan2(circle1.yPos - rect1.middleYPos, circle1.xPos - rect1.middleXPos);
                point1.xPos = rect1.middleXPos + (rect1.halfLineThrough * cos(angle));
                point1.yPos = rect1.middleYPos + (rect1.halfLineThrough * sin(angle));
                
                //Step 2 : Constrain the point into the rectangle
                point1.xPos = constrain(point1.xPos, rect1.xPos, rect1.xPos + rect1.width);
                point1.yPos = constrain(point1.yPos, rect1.yPos, rect1.yPos + rect1.height);
                
                //Step 3 : check if the point is colliding with the circle
                 circle1.pointDist = dist(circle1.xPos, circle1.yPos, point1.xPos, point1.yPos);
                 return (circle1.pointDist < circle1.radius);
            },
            applyCollision : function(rect1, circle1)
            {
                var point1 = {};
                angle = atan2(rect1.middleYPos - circle1.yPos, rect1.middleXPos - circle1.xPos);
                point1.xPos = rect1.xPos + (circle1.radius * cos(angle));
                point1.yPos = rect1.yPos + (circle1.radius * sin(angle));
                var escape = circle1.radius - circle1.pointDist;
                rect1.xPos += escape * cos(angle);
                rect1.yPos += escape * sin(angle);
            },
        };
        
        var draw = function()
        {
            background(30, 150, 30);
            
            if(mouseIsPressed)
            {
                block.xPos = mouseX - block.width / 2;
                block.yPos = mouseY - block.height / 2;
            }
            else if(Observer.colliding(block, circle))
            {
                Observer.applyCollision(block, circle);
            }
            
            circle.draw();
            block.draw();
        };
    }
    if (typeof draw !== 'undefined') processing.draw = draw;
});