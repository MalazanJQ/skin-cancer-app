from flask import Flask, request, jsonify
import cv2
import numpy as np
import pickle
import torch
from flask_cors import CORS
import torch.nn.functional as F

HEIGHT = 300
WIDTH = 300
MEAN = np.array([138.59368974, 144.15611658, 182.05335672])
STD_DEV = np.array([57.58242606, 53.78604796, 55.97474568])

app = Flask(__name__)
CORS(app)

with open("./model_c", "rb") as file:
  model = pickle.load(file)

model.eval()

def preprocess(image):
  image = cv2.resize(image, (HEIGHT, WIDTH))
  image_array = np.array(image).astype(np.float32)
  image_array = (image_array - MEAN) / STD_DEV
  image_array = np.transpose(image_array, (2, 0, 1))
  image_tensor = torch.tensor(image_array, dtype=torch.float32)
  image_tensor = image_tensor.unsqueeze(0)
  return image_tensor

@app.route('/upload', methods=['POST'])
def upload():
  if 'file' not in request.files:
      return "No image found", 400
  file = request.files['file']
  file_bytes = np.frombuffer(file.read(), np.uint8)
  image = preprocess(cv2.imdecode(file_bytes, cv2.IMREAD_COLOR))

  with torch.no_grad():
      output = model(image)
      probabilities = F.softmax(output, dim=1)
  benign = probabilities[0][0].item()
  malignant = probabilities[0][1].item()
  prediction = "benign" if benign > malignant else "malignant"
  print(output)
  print(f"Prediction: {prediction}, Benign Probability: {benign:.4f}, Malignant Probability: {malignant:.4f}")
  return jsonify({"prediction": prediction, "benign": benign, "malignant": malignant})

if __name__ == "__main__":
    app.run(debug=True)