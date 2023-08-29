import fs from "fs/promises";

export default async (req, res) => {
  try {
    const jsonData = await fs.readFile("./quizData.json", "utf-8");
    const data = JSON.parse(jsonData);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
};
