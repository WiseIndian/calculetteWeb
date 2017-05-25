package controllers


import util.parsing.combinator.RegexParsers
import scala.collection.mutable.Buffer
import javax.inject._
import play.api._
import play.api.mvc._
import play.twirl.api._
import play.api.libs.json._




case class TwoDVector(x: Double, y: Double)
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
	def add() = Action(BodyParsers.parse.json) { request => 
		val textResult: JsResult[TwoDVector] = 
			request.body.validate[TwoDVector](vectorReads)

		textResult.map { v => 
			Ok((v.x + v.y).toString)
		}.getOrElse {
			BadRequest(
				"Please provide a json containing x and y\n"+
				"attributes that must be numbers. You provided:\n"+request.body
			)
		}
	}

	/* An Action that returns the home page */
	def homepage() = Action { req => 
		Ok(views.html.index())
	}
}
