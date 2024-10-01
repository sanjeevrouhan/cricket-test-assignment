import { useContext, useState, useRef, useEffect } from "react";
import { CricketContext } from "./Board";
import { CricketContextType, IBallCommentary } from "./interfaces";
import { CircleText } from "../ui/circleText";

const BallCommentary = () => {
  const context: CricketContextType = useContext(CricketContext);
  const [comments, setComments] = useState<IBallCommentary[]>([]);

  // State to handle the visibility of dropdowns
  const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (context) {
      setComments(context?.ballCommentary || []);
    }
  }, [context?.ballCommentary]);

  // Function to handle delete action
  const handleDelete = (id: string) => {
    setComments(comments.filter((comment) => comment._id !== id));
    setVisibleDropdown(null); // Close the dropdown after delete
  };

  // Function to toggle dropdown visibility
  const toggleDropdown = (id: string) => {
    setVisibleDropdown((prevVisible) => (prevVisible === id ? null : id));
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownRef = visibleDropdown ? dropdownRefs.current[visibleDropdown] : null;
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        setVisibleDropdown(null);
      }
    };

    if (visibleDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visibleDropdown]);

  const filterComments = (text: string) => {
    if (!text.trim()) {
      setComments(context?.ballCommentary || []);
    } else {
      const filteredComments =
        context?.ballCommentary?.filter((comment: IBallCommentary) => {
          return comment.commentary.toLowerCase().includes(text.toLowerCase());
        }) || [];
      setComments(filteredComments);
    }
  };

  return (
    <>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search..."
        onChange={(e) => filterComments(e.target.value)}
      />
      <ul className="list-group">
        {comments.map((comment: IBallCommentary) => (
          <li
            key={comment._id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{ position: "relative" }}
          >
            <CircleText score={comment.runs} comment={comment.commentary} />
            <div
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={() => toggleDropdown(comment._id)}
            >
              ⋮
            </div>

            {/* Custom Dropdown Menu */}
            {visibleDropdown === comment._id && (
              <div
                ref={(ref) => (dropdownRefs.current[comment._id] = ref)}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  backgroundColor: "white",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                  zIndex: 1,
                }}
              >
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  <li
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      color: "red",
                    }}
                    onClick={() => handleDelete(comment._id)}
                  >
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default BallCommentary;
