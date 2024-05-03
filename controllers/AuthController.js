const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

class AuthController {
    static async login(req, res){
        try {
            let user = await prisma.user.findUnique({
                where: {
                    email: req.body.email
                }
            })

            // Generate token
            const expireAt = new Date()
            expireAt.setTime(expireAt.getTime() + (30*60*1000))

            const token = Math.floor(100000 + Math.random() * 900000).toString()
            const tokenResp = await prisma.token.create({
                data: {
                    token: token,
                    expired_at: expireAt
                }
            })

            // Create the account if there is no account were made before
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: req.body.email,
                        tokenId: tokenResp.id
                    }
                })
            } else {
                user = await prisma.user.update({
                    where: {
                        id: Number(user.id)
                    },
                    data: {
                        tokenId: tokenResp.id
                    }
                })
            }

            return res.status(200).json({token: token})
        } catch (error) {
            return res.status(500).json({resp: error})
        }
    }
}

module.exports = AuthController