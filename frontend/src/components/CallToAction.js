import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex  flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center ">
      <div className="flex-1 justify-center flex flex-col">
      <h2 className="text-2xl">
        want to learn more about javascript?
      </h2>
      <p className="text-gray-500 my-2">
        check out these resources with 100 javascript projects
      </p>
      <Button gradientDuoTone='purpleToPink' className="rounded-tl-xl rounded-bl-none">
          <a href="https://www.100jsprojects.com/" target="_blank" rel="noopener noreferrer">learn More</a>
      </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://miro.medium.com/v2/resize:fit:800/0*4aIfxfeoj7zBbulO.png"/>
      </div>
    </div>
  )
}
