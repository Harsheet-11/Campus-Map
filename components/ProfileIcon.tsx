type ProfileIconProps = {
  emoji?: string;
  size?: number;
};

export default function ProfileIcon({
  emoji = "😊",
  size = 48,
}: ProfileIconProps) {
  return (
    <div
      className="
        fixed
        top-4
        right-4
        z-50
        flex
        items-center
        justify-center
        rounded-full
        bg-gray-100
        shadow-md
      "
      style={{
        width: size,
        height: size,
        fontSize: size * 0.55,
        userSelect: "none",
      }}
    >
      {emoji}
    </div>
  );
}