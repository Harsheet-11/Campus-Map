export default function LoginPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Login Required</h2>
        <p>You need to login to upvote dishes.</p>

        <button onClick={() => window.location.href="/login"}>
          Login
        </button>

        <button onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

