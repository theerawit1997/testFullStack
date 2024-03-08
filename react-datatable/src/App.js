import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Image",
    selector: (row) => row.coverimage,
  },
  {
    name: "Name",
    selector: (row) => row.name,
  },
  {
    name: "Detail",
    selector: (row) => row.detail,
  },
  {
    name: "Latitude",
    selector: (row) => row.latitude,
  },
  {
    name: "Longitude",
    selector: (row) => row.longitude,
  },
];

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [search, setSearch] = useState("");

  const API_BASE_URL = "http://localhost:5000/api/attractions";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      var url = `${API_BASE_URL}?page=${page}&per_page=${perPage}`;
      if (search) {
        url += `&search=${search}`;
      }
      if (sortColumn) {
        url += `&sort_column=${sortColumn}&sort_direction=${sortDirection}`;
      }
      const response = await axios.get(url);
      setData(response.data.data);
      setTotalRows(response.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, sortColumn, sortDirection]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleSort = (column, sortDirection) => {
    setSortColumn(column.name);
    setSortDirection(sortDirection);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    // Trigger search immediately as the user types
    fetchData();
  }; 

  useEffect(() => {
    fetchData();
  }, [fetchData, page, perPage, sortColumn, sortDirection]);

  return (
    <div>
      <form>
        <label>
          Search:
          <input type="text" name="search" onChange={handleSearchChange} />
        </label>
      </form>
      <DataTable
        title="Attractions"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onSort={handleSort}
      />
    </div>
  );
}

export default App;
