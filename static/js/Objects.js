export class Player {
    constructor(x, y, health, speed, sizeX, sizeY, image) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.speed = speed;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.image = image;
        this.boundingBox = null;
        this.inflated = false;
        this.inflationValue = 1.5;
    }

    inflate() {

        if (this.inflated) {
            return;
        }

        this.sizeX *= this.inflationValue;
        this.sizeY *= this.inflationValue;
        this.speed /= 5;
        this.x -= (this.sizeX / 6);
        this.y -= (this.sizeY / 6);
        this.inflated = true;
    }

    deflate() {
        this.sizeX /= 1.5;
        this.sizeY /= 1.5;
        this.speed *= 5;
        this.x += (this.sizeX / 6);
        this.y += (this.sizeY / 6);
        this.inflated = false;
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.sizeX, this.sizeY);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        return this.health;
    }

    getHealth() {
        return this.health;
    }

    healHeath(amount) {
        this.health += amount;
        return this.health;
    }

    move(dx, dy) {

        if (this.boundingBox) {
            var bounds = this.boundingBox.getBounds();

            if (this.x + dx * this.speed < bounds.left || this.x + dx * this.speed + this.sizeX > bounds.right) {
                dx = 0;
            }

            if (this.y + dy * this.speed < bounds.top || this.y + dy * this.speed + this.sizeY > bounds.bottom) {
                dy = 0;
            }
        }

        this.x += dx * this.speed;
        this.y += dy * this.speed;
    }

    setBoundingBox(boundingBox) {
        this.boundingBox = boundingBox;
    }

    getBoundingBox() {
        return this.boundingBox;
    }

    isColliding(other) {

        var playerBounds = {
            left: this.x,
            right: (this.x + this.sizeX),
            top: this.y,
            bottom: (this.y + this.sizeY)
        };

        var otherBounds = {
            left: other.x  + 5,
            right: (other.x + other.sizeX) - 5,
            top: other.y  + 5,
            bottom: (other.y + other.sizeY) - 5
        };
        
        return !(playerBounds.right < otherBounds.left || playerBounds.left > otherBounds.right || playerBounds.bottom < otherBounds.top || playerBounds.top > otherBounds.bottom);
    }

    isInflated() {
        return this.inflated;
    }


}

export class Projectile {
    constructor(x, y, speed, directionX, directionY, sizeX, sizeY, image, id, damage) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.directionX = directionX;
        this.directionY = directionY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.image = image;
        this.damage = damage;
    }

    update() {
        this.x += this.speed * this.directionX;
        this.y += this.speed * this.directionY;
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.sizeX, this.sizeY);
        }
    }

    getId() {
        return this.id;
    }

    destroy() {
        this.x = -1000;
        this.y = -1000;
        this.speed = 0;
    }

    getDamage() {
        return this.damage;
    }


}

export class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}

export class BoundingBox {
    
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    draw(ctx) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    getMiddle() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

}

export class Enemy {

    constructor(x, y, sizeX, sizeY, health, image) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.health = health;
        this.image = image;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        return this.health;
    }

    getHealth() {
        return this.health;
    }

    healHeath(amount) {
        this.health += amount;
        return this.health;
    }

    move(dx, dy) {
        this.x += dx * this.speed;
        this.y += dy * this.speed;
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.sizeX, this.sizeY);
        }
    }
}

