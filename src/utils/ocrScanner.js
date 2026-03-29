export async function scanMarksheet(imageFile, onProgress) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey || apiKey.length < 10) {
    throw new Error("MISSING_KEY: Add VITE_OPENAI_API_KEY to .env and restart")
  }

  onProgress(20)

  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(",")[1])
    reader.onerror = () => reject(new Error("Could not read file"))
    reader.readAsDataURL(imageFile)
  })

  onProgress(50)

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `This is an Anna University student marksheet or result page.
Extract every subject code and grade from the result table.

Subject codes look like: EC3151, MA3151, GE3151, CS3301
Valid grades only: O, A+, A, B+, B, C, RA, U/A, WH, SA, AB

Return ONLY a raw JSON array, no markdown, no explanation:
[{"code":"EC3151","grade":"O"},{"code":"MA3151","grade":"A+"}]

If this is not a marksheet return exactly: []`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${imageFile.type || "image/jpeg"};base64,${base64}`,
                detail: "high"
              }
            }
          ]
        }
      ]
    })
  })

  onProgress(80)

  const raw = await response.text()
  console.log("OpenAI status:", response.status)
  console.log("OpenAI response:", raw)

  if (!response.ok) {
    let msg = "OpenAI API error " + response.status
    try {
      const j = JSON.parse(raw)
      msg = j.error?.message || msg
    } catch {}
    throw new Error("API_ERROR: " + msg)
  }

  const data = JSON.parse(raw)
  const text = data.choices?.[0]?.message?.content || "[]"
  console.log("GPT-4o mini output:", text)

  let matches = []
  try {
    const clean = text.replace(/```json/gi,"").replace(/```/g,"").trim()
    matches = JSON.parse(clean)
    if (!Array.isArray(matches)) matches = []
  } catch {
    console.error("Parse failed:", text)
    matches = []
  }

  onProgress(100)
  console.log("Final matches:", matches)
  return { matches, rawText: text }
}

export async function validateMarksheet(imageFile) {
  if (!imageFile) {
    return { valid: false, reason: "No file selected." }
  }
  
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"]
  if (!validTypes.includes(imageFile.type) && !imageFile.type.startsWith("image/")) {
    return { 
      valid: false, 
      reason: "Please upload an image file. JPG, PNG or screenshot only." 
    }
  }

  if (imageFile.size < 5000) {
    return { 
      valid: false, 
      reason: "Image too small. Please upload a full-size screenshot." 
    }
  }

  if (imageFile.size > 25000000) {
    return { 
      valid: false, 
      reason: "Image too large (max 25MB). Please compress it first." 
    }
  }

  return { valid: true, reason: null }
}

export function checkIfMarksheet(matches) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return {
      valid: false,
      reason: "This image does not appear to be an Anna University marksheet. Please upload your official result screenshot from coe1.annauniv.edu or your college portal."
    }
  }
  return { valid: true, reason: null }
}
