import React, { Component } from "react";
import ReactDOM from "react-dom";
import PanAndZoom from "./lib/panAndZoom";

class App extends Component {
	state = {};
	render() {
		return (
			<div className="App">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Cras non est eu felis cursus sollicitudin sed in velit. Sed
					turpis nisl, rutrum vitae arcu vel, pharetra gravida nunc.
					Aliquam erat volutpat. Sed eu risus finibus dolor ultrices
					viverra nec eu mi. Duis vel lectus ornare, sodales elit sit
					amet, ullamcorper leo. Sed eget felis at quam dignissim
					porta ut id ex. Suspendisse semper fermentum sollicitudin.
					Aenean augue dolor, consectetur non dignissim in, ornare at
					augue. Fusce a efficitur augue. Sed sit amet urna at odio
					feugiat sollicitudin. Mauris arcu orci, aliquet in posuere
					et, vulputate nec enim. Pellentesque vehicula ligula mauris,
					at luctus est dictum ut. Praesent id bibendum ligula. Mauris
					interdum, neque sit amet condimentum cursus, dolor nunc
					consectetur diam, vel rutrum nibh leo non elit.
				</p>
				<PanAndZoom height="500px" width="100%">
					<img
						src="./assets/20190504_131809.jpg"
						alt="Sample landscape"
					/>
				</PanAndZoom>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Cras non est eu felis cursus sollicitudin sed in velit. Sed
					turpis nisl, rutrum vitae arcu vel, pharetra gravida nunc.
					Aliquam erat volutpat. Sed eu risus finibus dolor ultrices
					viverra nec eu mi. Duis vel lectus ornare, sodales elit sit
					amet, ullamcorper leo. Sed eget felis at quam dignissim
					porta ut id ex. Suspendisse semper fermentum sollicitudin.
					Aenean augue dolor, consectetur non dignissim in, ornare at
					augue. Fusce a efficitur augue. Sed sit amet urna at odio
					feugiat sollicitudin. Mauris arcu orci, aliquet in posuere
					et, vulputate nec enim. Pellentesque vehicula ligula mauris,
					at luctus est dictum ut. Praesent id bibendum ligula. Mauris
					interdum, neque sit amet condimentum cursus, dolor nunc
					consectetur diam, vel rutrum nibh leo non elit.
				</p>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
