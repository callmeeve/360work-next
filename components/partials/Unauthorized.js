import Link from "next/link";

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold text-center mb-4">
        You are not authorized to view this page
      </h1>
      <Link href="/">
        <a className="px-4 py-2 bg-primary text-white rounded">Go back to login</a>
      </Link>
    </div>
  );
}

export default Unauthorized;