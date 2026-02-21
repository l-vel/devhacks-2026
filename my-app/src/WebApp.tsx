import DataVisualization from "../public/dataVisualization";
import FrequencyList from "../public/FrequencyList";
import { NavLink, Routes, Route } from "react-router-dom";

function WebApp() {

  return (
    <div>

      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <div className="collapse navbar-collapse">

            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  My Statistics
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/frequency">
                  Frequency Word List
                </NavLink>
              </li>
            </ul>

          </div>
        </div>
      </nav>


      <Routes>
        <Route path="/" element={<DataVisualization />} />
        <Route path="/frequency" element={<FrequencyList />} />
      </Routes>


    </div >
  );
}

export default WebApp;