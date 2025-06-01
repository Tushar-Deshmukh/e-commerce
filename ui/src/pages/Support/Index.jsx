const Support = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <h1 className="text-2xl font-bold mb-4">Support</h1>
          <p className="text-base text-gray-700 mb-2">
            <strong>Call us:</strong>{" "}
            <a href="tel:9519999999" className="link link-hover text-blue-600">
              951-999-9999
            </a>
          </p>
          <p className="text-base text-gray-700">
            <strong>Email us:</strong>{" "}
            <a
              href="mailto:info@e-commerce@gmail.com"
              className="link link-hover text-blue-600"
            >
              info@e-commerce@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
