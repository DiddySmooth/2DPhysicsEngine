# 2DPhysicsEngine



# Detecting Collision 
to detect collision between two circle we take the origin of the 2 circles draw a vector between them. If that vector is less than circle1's radius plus circle2's radius they are colliding.
dist.x = c1x -c2x
dist.y = c1y -c2y
distance = sqrt((distx²) + (disty²)) 
if distance < (c1r + c2r)