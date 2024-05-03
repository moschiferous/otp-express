const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

class AuthController {
    static async tokenGetter(req, res){
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

    static async tokenChecker(req, res) {
        try {
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    email: req.body.email
                }
            })
            
            const token = await prisma.token.findUnique({
                where: {
                    id: Number(user.tokenId)
                }
            })

            // Validate the token
            if (token.expired_at < new Date()) {
                return res.status(401).json({resp: "Token expired"})
            }

            if (req.query.token != token.token) {
                return res.status(401).json({resp: "Denied"})
            }

            // Make the token expired because its already used
            await prisma.token.update({
                where: {
                    id: token.id
                },
                data: {
                    expired_at: new Date()
                }
            })
            return res.status(200).json({resp: "Pass"})

        } catch (error) {
            return res.status(500).json({msg: error})
        }
    }
}

module.exports = AuthController