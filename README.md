Classifies uploaded images of skin cancer (or anything!) into the binary classifications of "malignant" or "benign" based on a machine learning model. The model is a convolutional neural network with three convolutional and pooling layers and one fully connected layer that was implemented with Pytorch. The model was trained on the dataset <a href=https://doi.org/10.34740/KAGGLE/DSV/3376422> Melanoma Skin Cancer Dataset of 10000 Images</a> by Muhammad Hasnain Javid.

# How to Use
From the root folder to initiate the backend:

```python ./functions/predict```

From the root folder to initiate the app:

```npm run start```

The app will be up on http://localhost:3000/. Alternatively, you can initiate just the backend and upload the images <a href=https://skin-cancer-ml-app.netlify.app/>here</a>. Images are passed directly to the model and are not stored.
