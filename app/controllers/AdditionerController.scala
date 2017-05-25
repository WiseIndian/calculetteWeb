package controllers


import play.api.libs.concurrent.Execution.Implicits._ //for the implicit execution context necessary for simulating a long computation time of an addition
import javax.inject._
import scala.concurrent.Future
import play.api._
import play.api.mvc._
import play.api.libs.json._




case class TwoDVector(x: Double, y: Double) {
	def add: Double = x + y
}
/**
 * This controller creates `Action`s to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class AdditionerController extends Controller {

	val vectorReads: Reads[TwoDVector] =
		Json.reads[TwoDVector]

	/* An Action that handles HTTP POST requests 
	 * that need the addition of two numbers x and y contained in a JSON 
	 * object.
 	 */
	def add() = Action.async(BodyParsers.parse.json) { request => 
		val textResult: JsResult[TwoDVector] = 
			request.body.validate[TwoDVector](vectorReads)

		val addRes: Result = textResult.map { v => 
			Ok(v.add.toString) //the result as a string
		}.getOrElse {
			BadRequest(
				"Please provide a json containing x and y\n"+
				"attributes that must be numbers. You provided:\n"+
				request.body
			)
		}

		Future {
			Thread.sleep(2000) //simulating a long computation time
			addRes
		}
	}

	/* An Action that returns the home page */
	def homepage() = Action { req => 
		Ok(views.html.index())
	}
}
