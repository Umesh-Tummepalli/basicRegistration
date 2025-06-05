import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import {
  User,
  Calendar,
  ShoppingBag,
  Heart,
  Ruler,
  Phone,
  Globe,
  Mail,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
export default function ProfileSetup() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    gender: "",
    dateOfBirth: "",

    // Style Preferences
    stylePreferences: [],
    preferredBrands: [],

    // Size Information
    shirtSize: "",
    pantSize: "",
    shoeSize: "",

    // Contact & Communication
    phoneNumber: "",
    country: "",
    language: "",
    newsletter: false,
  });

  const [newBrand, setNewBrand] = useState("");
  const navigate=useNavigate();
  const styleOptions = [
    "Casual",
    "Formal",
    "Streetwear",
    "Bohemian",
    "Minimalist",
    "Vintage",
    "Sporty",
    "Elegant",
    "Trendy",
    "Classic",
  ];

  const popularBrands = [
    "Nike",
    "Adidas",
    "Zara",
    "H&M",
    "Uniqlo",
    "Gap",
    "Levi's",
    "Calvin Klein",
    "Tommy Hilfiger",
    "Ralph Lauren",
  ];

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "India",
    "Japan",
    "Other",
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Hindi",
    "Other",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const addCustomBrand = () => {
    if (
      newBrand.trim() &&
      !formData.preferredBrands.includes(newBrand.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        preferredBrands: [...prev.preferredBrands, newBrand.trim()],
      }));
      setNewBrand("");
    }
  };

  const removeBrand = (brand) => {
    setFormData((prev) => ({
      ...prev,
      preferredBrands: prev.preferredBrands.filter((b) => b !== brand),
    }));
  };

  const handleSubmit = () => {
    console.log("Profile setup data:", formData);
    // Add your profile setup logic here
    let form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }
    async function submit() {
      try {
        let res = await axios.patch(
          `http://localhost:3000/api/user/${id}/profile`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if(res.status===201){
          navigate('/updated');
        }
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    submit();
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step <= currentStep
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 transition-all ${
                step < currentStep
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Personal Information
        </h3>
        <p className="text-gray-600">Help us personalize your experience</p>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Gender
        </label>
        <div className="grid grid-cols-2 gap-3">
          {["Male", "Female", "Non-binary", "Prefer not to say"].map(
            (option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleInputChange("gender", option)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  formData.gender === option
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-300 hover:border-purple-300"
                }`}
              >
                {option}
              </button>
            )
          )}
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Style Preferences
        </h3>
        <p className="text-gray-600">Tell us what you love to wear</p>
      </div>

      {/* Style Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Style Preferences (Select multiple)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {styleOptions.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => handleArrayToggle("stylePreferences", style)}
              className={`p-2 rounded-lg border text-sm transition-all ${
                formData.stylePreferences.includes(style)
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 hover:border-purple-300"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Brands */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Brands
        </label>

        {/* Popular Brands */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {popularBrands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => handleArrayToggle("preferredBrands", brand)}
              className={`p-2 rounded-lg border text-sm transition-all ${
                formData.preferredBrands.includes(brand)
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 hover:border-purple-300"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Add Custom Brand */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="Add custom brand"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={addCustomBrand}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Custom Brands */}
        {formData.preferredBrands.filter(
          (brand) => !popularBrands.includes(brand)
        ).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.preferredBrands
              .filter((brand) => !popularBrands.includes(brand))
              .map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {brand}
                  <button
                    type="button"
                    onClick={() => removeBrand(brand)}
                    className="ml-2 hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Size Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Size Information
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Shirt Size
            </label>
            <select
              value={formData.shirtSize}
              onChange={(e) => handleInputChange("shirtSize", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">Select</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Pant Size
            </label>
            <select
              value={formData.pantSize}
              onChange={(e) => handleInputChange("pantSize", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">Select</option>
              <option value="28">28</option>
              <option value="30">30</option>
              <option value="32">32</option>
              <option value="34">34</option>
              <option value="36">36</option>
              <option value="38">38</option>
              <option value="40">40</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Shoe Size
            </label>
            <select
              value={formData.shoeSize}
              onChange={(e) => handleInputChange("shoeSize", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">Select</option>
              {Array.from({ length: 13 }, (_, i) => i + 6).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Phone className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Contact & Communication
        </h3>
        <p className="text-gray-600">Stay connected with us</p>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number (Optional)
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country/Region
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none"
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Language
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={formData.language}
            onChange={(e) => handleInputChange("language", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none"
          >
            <option value="">Select your language</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.newsletter}
            onChange={(e) => handleInputChange("newsletter", e.target.checked)}
            className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <div>
            <span className="font-medium text-gray-700">
              Subscribe to Newsletter
            </span>
            <p className="text-sm text-gray-600 mt-1">
              Get the latest fashion trends, exclusive offers, and style tips
              delivered to your inbox.
            </p>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <ShoppingBag className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-white/80">
            Let's personalize your shopping experience
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Complete Setup
              </button>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center mt-4">
            <button
              onClick={handleSubmit}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
