export const CircleText = ({ score, comment }: { score: number; comment: string }) => {
  return (
    <div className="d-flex align-items-center">
      <div
        className="d-flex justify-content-center align-items-center rounded-circle border border-primary"
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: "lightblue",
          marginRight: "8px",
        }}
      >
        <span className="text-primary">{score}</span>
      </div>
      <span className="text-dark">{comment}</span>
    </div>
  );
};
