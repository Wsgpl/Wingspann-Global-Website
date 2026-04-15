export default function Contact() {
  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-stretch md:items-center bg-black py-10 md:py-0">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-80 border-none outline-none"
        >
          <source src="/3946082-uhd_2160_4096_25fps.mp4" type="video/mp4" />
        </video>
        {/* Subtle overlay for better readability on smaller screens */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/20"></div>
      </div>

      {/* Floating Content Box */}
      <div className="relative z-10 w-full mx-4 md:mx-0 md:w-[550px] lg:w-[650px] bg-[#2A2925] p-8 sm:p-10 md:p-14 md:ml-auto md:mr-10 lg:mr-24 border-l-4 border-red-600 shadow-2xl flex flex-col justify-center">

        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl text-white font-medium mb-6 leading-[1.3] text-shadow">
          Pioneer the next generation of autonomous flight in an environment built for those who thrive on complex engineering challenges.
        </h2>

        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 sm:mb-10 font-light">
          Collaborate with forward-thinking professionals dedicated to pushing the limits of technology. Discover roles that empower you to grow, innovate, and make a lasting impact on the aerospace industry.
        </p>

        <div>
          <a
            href="/careers"
            className="inline-block bg-red-600 hover:bg-white text-white hover:text-red-600 font-semibold tracking-wider py-4 px-6 sm:px-8 text-sm sm:text-base transition-colors duration-300"
          >
            Explore your future at Wingspann
          </a>
        </div>
      </div>
    </section>
  );
}
