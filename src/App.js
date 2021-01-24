import NavigatorMap, { RobotIcon } from './components/NavigatorMap';

function App() {
  return (
    <div className="App">
      <NavigatorMap
        src="https://pic2.zhimg.com/v2-98d09c1c99edda82d74ec70fc82bd7bd_b.jpg"
        onPositionSelect={(position) => {
          console.log('selectPosition', position);
        }}
      >
        <RobotIcon position={{ x: 10, y: 20, angle: 255 }} />
        <RobotIcon position={{ x: 80, y: 120, angle: 25 }} />
        <RobotIcon position={{ x: 480, y: 220, angle: 0 }} />
      </NavigatorMap>
      {/* <NavigatorMap src="https://p1.pstatp.com/large/pgc-image/6599dea9667440b7872dbf49bc55f96f"></NavigatorMap> */}
    </div>
  );
}

export default App;
