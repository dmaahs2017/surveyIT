import { NavBar } from "../components/NavBar";
import { Box, SimpleGrid, Image } from "@chakra-ui/core";


const Index = () => (
  <div>
    <NavBar />
    <div className="container">
      <h1 className="title">Welcome To Survey IT!</h1>
      <div className="columns">
        <div className="col1">
          <h2 className="title">Quick Links: </h2>
          <ul>
            <li>
              1
            </li>
            <li>
              2
            </li>
            <li>
              .
            </li><li>
              .
            </li><li>
              .
            </li><li>
              n
            </li>
          </ul>
        </div>
        <div className="col2" style={{width:"40%"}}>
          <h1>Get FREE rewards and figt cards by filling surveys!</h1>
          <h1>Take your first survey and earn $ in few minutes</h1>
        </div>
        <div className="col3">
          <div>
          <Image className="img" src="https://dcassetcdn.com/design_img/1559024/551167/551167_7840631_1559024_911ff84c_image.png" />
          </div>
          </div>
      </div>
    </div>
  </div>
);

export default Index;
