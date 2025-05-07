import { Formik, Form } from "formik";
import React from "react";
import { Link } from "react-router";
import facebook from "../assets/images/facebook.png";
import instagram from "../assets/images/instagram.png";
import pinterest from "../assets/images/pinterest.png";
import twitter from "../assets/images/twitter.png";

const Footer = () => {
  return (
    <footer className="border-t border-t-gray-300">
      <div className="container">
        <div className="flex flex-col lg:flex-row pt-4">
          <div className="w-full pt-2 mb-4 lg:mr-4 border-b border-[#eceef3] lg:border-b-0 lg:border-r">
            <div className="pb-3">
              <h3 className="uppercase font-medium text-gray-800 text-lg">
                Customer Service
              </h3>
            </div>

            <div>
              <ul>
                <li className="pb-2 text-gray-600 hover:text-black hover:underline hover:underline-offset-1">
                  <Link to="#">Contact Us</Link>
                </li>

                <li className="pb-2 text-gray-600 hover:text-black hover:underline hover:underline-offset-1">
                  <Link to="#">Sell With Us</Link>
                </li>

                <li className="pb-2 text-gray-600 hover:text-black hover:underline hover:underline-offset-1">
                  <Link to="#">Shipping</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full pt-2 mb-4 lg:mr-4 border-b border-[#eceef3] lg:border-b-0 lg:border-r">
            <div className="pb-3">
              <h3 className="uppercase font-medium text-gray-800 text-lg">
                Links
              </h3>
            </div>

            <div>
              <ul>
                <li className="pb-2 text-gray-600 hover:text-black hover:underline hover:underline-offset-1">
                  <Link to="#">Contact Us</Link>
                </li>

                <li className="pb-2 text-gray-600 hover:text-black hover:underline hover:underline-offset-1">
                  <Link to="#">Sell With Us</Link>
                </li>

                <li className="pb-2 text-gray-600 hover:text-black hover:underline hover:underline-offset-1">
                  <Link to="#">Shipping</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full pt-2 mb-4 lg:mr-4">
            <div className="pb-3">
              <h3 className="uppercase font-medium text-gray-800 text-lg">
                Newsletter
              </h3>
            </div>

            <div>
              <ul>
                <li className="pb-2 text-gray-600">
                  Subscribe to Our Newsletter
                </li>
              </ul>
            </div>

            <Formik
              initialValues={{
                email: "",
              }}
            >
              {() => (
                <Form>
                  <div className="flex flex-col xl:flex-row">
                    <input
                      type="text"
                      className="input rounded-none focus:outline-0 w-full"
                      placeholder="Please enter your email"
                    />
                    <button className="w-full xl:w-auto mt-2 xl:mt-0 btn btn-outline btn-primary rounded-none border border-[#e4e6eb] text-gray-600 font-normal hover:text-white hover:bg-blue-600 hover:shadow-none">
                      Subscribe
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className="py-4 text-center">
          <span>&copy; {new Date().getFullYear()} MERN Store</span>
        </div>

        <div className="mb-3">
          <ul className="flex justify-center items-center gap-2">
            <li className="w-10 h-10">
              <Link>
                <img src={facebook} />
              </Link>
            </li>

            <li className="w-10 h-10">
              <Link>
                <img src={instagram} />
              </Link>
            </li>

            <li className="w-10 h-10">
              <Link>
                <img src={pinterest} />
              </Link>
            </li>

            <li className="w-10 h-10">
              <Link>
                <img src={twitter} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
