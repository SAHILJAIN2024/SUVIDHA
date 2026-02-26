export default async function handler(req, res) {
  const { ward_id, department } = req.body;

  // Example mapping logic
  const officeMapping = {
    electricity: "Electricity Ward Office",
    gas: "Gas Distribution Office",
    municipal: "Municipal Corporation Office",
  };

  return res.status(200).json({
    office_name: officeMapping[department],
  });
}