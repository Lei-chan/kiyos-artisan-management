import { DisplayMessageData } from "../lib/definitions";

export default function PMessage({ type, message }: DisplayMessageData) {
  return (
    <p
      className={`w-[18rem] py-0.5 px-1 rounded text-center ${type === "error" ? "bg-orange-600" : type === "pending" ? "bg-yellow-600" : "bg-green-400"} text-white text-sm`}
    >
      {message}
    </p>
  );
}
