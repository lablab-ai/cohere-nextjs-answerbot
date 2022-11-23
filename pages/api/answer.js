// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require("dotenv").config();

const cohere = require("cohere-ai");
cohere.init(process.env.COHERE_API_KEY);

export default async function handler(req, res) {
  try {
    const { question, companyData } = req.body;
    const response = await cohere.generate({
      model: 'xlarge', 
      prompt: `This program will answer questions based on the provided data:\n\nData: Siemens AG is a German multinational conglomerate corporation and the largest industrial manufacturing company in Europeheadquartered in Munich with branch offices abroad. Siemens & Halske was founded by Werner von Siemens and Johann Georg Halske on 1 October 1847. The principal divisions of the corporation are Industry, Energy, Healthcare (Siemens Healthineers), and Infrastructure & Cities, which represent the main activities of the corporation.The corporation is a prominent maker of medical diagnostics equipment and its medical health-care division, which generates about 12 percent of the corporation\'s total sales, is its second-most profitable unit, after the industrial automation division. In this area, it is regarded as a pioneer and the company with the highest revenue in the world.The corporation is a component of the Euro Stoxx 50 stock market index. Siemens and its subsidiaries employ approximately 303,000 people worldwide and reported global revenue of around €62 billion in 2021 according to its earnings release.\n\nQuestion: When the company was founded?\nAnswer: on 1 October 1847.\n--\nQuestion: How are you?\nAnswer: This question is not related to the company.\n--\nQuestion: Who was/were the founder?\nAnswer: Werner von Siemens and Johann Georg Halske\n--\nData:${companyData}\nQuestion: ${question}?\nAnswer:`, 
      max_tokens: 100, 
      temperature: 0.6, 
      k: 0, 
      p: 1, 
      frequency_penalty: 0, 
      presence_penalty: 0, 
      stop_sequences: ["--"], 
      return_likelihoods: 'NONE' 
    });

    res.status(200).json({ summary: response.body.generations[0].text.slice(0,-3) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ summary: "Error" });
  }
}
