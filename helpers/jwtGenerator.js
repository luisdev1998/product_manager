import jwt from 'jsonwebtoken'

const jwtGenerator = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
}

export default jwtGenerator;