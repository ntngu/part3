const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={filter} onChange={handleFilterChange}></input>
    </div>
  );
};

export default Filter;
