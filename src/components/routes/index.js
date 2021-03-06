// import preact
import { h, render, Component } from 'preact';

// import stylesheets for iphone, button
import style from './style.less';
import style_topnav from '../topnav/style';
import style_iphone from '../iphone/style';

export default class Route extends Component {

    // the main render method for the routes component
	render() {

		return (
    		<div class={ style.container }>


					{/* Each grid element represents settings for a route, inputted by the user */}
					<div class={ style_iphone.homepage }>
						<div class={ style.plusbutton }>
							<button-left><i class="fa fa-plus-circle" id="addRoute"> <text-add>Add Route</text-add></i></button-left><br />
						</div>
    				<div class={ style.grid }>
    					<div class= {style.gridchild1 }><table class={ style.table }><tr><td><div class={ style.starchecked }>
								<span class="fa fa-star"></span></div></td></tr><tr><td>UNI</td><td>Start: Home</td></tr><tr><td>8 am</td><td>End: QMUL</td></tr></table></div>
    					<div class= {style.gridchild2 }><button-right><i class="fa fa-edit" id="editroute"></i></button-right></div>
    				</div>

						<div class={ style.grid }>
							<div class= {style.gridchild1 }><table class={ style.table }><tr><td><div class={ style.starchecked }>
								<span class="fa fa-star"></span></div></td></tr><tr><td>GYM</td><td>Start: W12</td></tr><tr><td>6 pm</td><td>End: W18</td></tr></table></div>
							<div class= {style.gridchild2 }> <button-right><i class="fa fa-edit"></i></button-right></div>
						</div>

						<div class={ style.grid }>
							<div class= {style.gridchild1 }><table class={ style.table }><tr><td><div class={ style.starchecked }>
								<span class="fa fa-star"></span></div></td></tr><tr><td>HOME</td><td>Start: E16</td></tr><tr><td>6 pm</td><td>End: SE18</td></tr></table></div>
							<div class= {style.gridchild2 }><button-right><i class="fa fa-edit" id="editroute"></i></button-right></div>
						</div>

    				<div class={ style.grid }>
    					<div class= {style.gridchild1 }><table class={ style.table }><tr><td><div class={ style.starunchecked }>
                        <span class="fa fa-star"></span></div></td></tr><tr><td>COFFEE TIME</td><td>Start: Home</td></tr><tr><td>11 am</td><td>End: Coffee store</td></tr></table></div>
    					<div class= {style.gridchild2 }> <button-right><i class="fa fa-edit"></i></button-right></div>
                    </div>

                    <div class={ style.grid }>
    					<div class= {style.gridchild1 }><table class={ style.table }><tr><td><div class={ style.starunchecked }>
                        <span class="fa fa-star"></span></div></td></tr><tr><td>FAMILY</td><td>Start: Home</td></tr><tr><td>5 pm</td><td>End: Family place</td></tr></table></div>
    					<div class= {style.gridchild2 }> <button-right><i class="fa fa-edit"></i></button-right></div>
                    </div>

                    <div class={ style.grid }>
    					<div class= {style.gridchild1 }><table class={ style.table }><tr><td><div class={ style.starunchecked }>
                        <span class="fa fa-star"></span></div></td></tr><tr><td>JAMES</td><td>Start: Home</td></tr><tr><td>12 am</td><td>End: James place</td></tr></table></div>
    					<div class= {style.gridchild2 }> <button-right><i class="fa fa-edit"></i></button-right></div>
                    </div>
                </div>
			</div>
		);
	}
}
