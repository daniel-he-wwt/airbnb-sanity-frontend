import { sanityWriteClient } from "../../../sanity"

// DELETE /tasks/:id
// Deletes the task document with the given id from Sanity.
export default async function handler(req, res) {
  const { id } = req.query

  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"])
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` })
  }

  if (!id) {
    return res.status(400).json({ message: "A task id is required" })
  }

  try {
    await sanityWriteClient.delete(id)
    return res.status(200).json({ message: `Task ${id} deleted` })
  } catch (error) {
    console.error(`Failed to delete task ${id}:`, error)
    return res.status(500).json({
      message: `Failed to delete task ${id}`,
      error: error.message,
    })
  }
}
