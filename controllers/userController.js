const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users: userContainer } = require("../cosmosClient");
const config = require("../config");
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
  const { username, password, isPrivate } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      isPrivate: isPrivate || false,
      type: "user",
    };

    await userContainer.items.create(user);
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { resources } = await userContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'user' AND c.username = @username",
        parameters: [{ name: "@username", value: username }],
      })
      .fetchAll();

    const user = resources[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: "24h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Identifiants invalides" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
