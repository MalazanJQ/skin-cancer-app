import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css";
import axios from 'axios';

/** Displays the UI of the Home Page. */
export default function SkinApp() {
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [predict, setPredict] = useState<React.ReactNode>(undefined);
  const [button, setButton] = useState<React.ReactNode>(<div></div>);
  const [image, setImage] = useState<File | undefined>(undefined);

  function previewImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = URL.createObjectURL(e.target.files[0]);
      setPreview(image);
      setImage(e.target.files[0]);
    }
  }

  const predictImage = useCallback(async () => {
    setButton(<div></div>);
    setPredict(<p className="mt-4">Loading model prediction...</p>);

    if (image) {
      const formData = new FormData();
      formData.append('file', image);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPredict(
          <div>
            <p className="text-center mt-4">Predicted class: {response.data.prediction}</p>
            <p>Benign probability: {response.data.benign}</p>
            <p>Malignant probability: {response.data.malignant}</p>
          </div>
        );
      } catch (error) {
        console.error("Error in predicting the image!", error);
      }
    }
  }, [image]);

  useEffect(() => {
    if (preview) {
      setButton(<button className="btn btn-secondary mt-4" onClick={predictImage}>Predict</button>);
      setPredict(null);
    } else {
      setButton(<div></div>);
    }
  }, [preview, predictImage]);

  /** Renders the correct page */
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Machine Learning Model to Classify Skin Cancer</h2>
      <p className="text-danger">
        WARNING: Not to be used to diagnose any disease. <br />This model was trained solely as an exercise to apply machine learning concepts
        and its predictions should not be used in any capacity.
      </p>
      <h4 className="mb-4">Upload an Image</h4>
      <div className="input-group mb-3">
        <input type="file" accept="image/*" className="form-control" id="inputGroupFile02" onChange={previewImage} />
        <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
      </div>
      {preview && (
        <div className="container text-center mt-4">
          <div className="row justify-content-md-center">
            <div className="col text-center">
              <img src={preview} alt="uploaded file" className="img-fluid mb-4" />
              <br />
            </div>
            <div className="col">
              {button}
              {predict}
            </div>
          </div>
        </div>
      )}
      <span>This model was trained on the following dataset:<br />
      Muhammad Hasnain Javid. (2022). Melanoma Skin Cancer Dataset of 10000 Images [Data set]. Kaggle. https://doi.org/10.34740/KAGGLE/DSV/3376422</span>
    </div>
  );
};