'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AboutPageComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Embracing Your Natural Beauty
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A journey from frustration to celebration, from confusion to confidence, 
            from fighting your curls to finally loving them.
          </p>
        </div>

        {/* Main Story Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Miwa&apos;s Story: A Tale of Two Worlds
            </h2>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  The Beginning: Two Cultures, One Beautiful Soul
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  In the quiet aftermath of war, in the resilient city of Hiroshima, 
                  a young woman named Miwa Tucker carried within her the strength of 
                  survivors and the hope of new beginnings. Her mother, a daughter of 
                  first-hand nuclear blast survivors, knew the weight of history and 
                  the preciousness of life. Her father, a son of Georgian cotton 
                  pickers from Baltimore, carried the legacy of resilience and 
                  determination in his very being.
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  The Beautiful Complexity of 3C Curls
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  When Miwa was born, her hair told a story of its own—tight, 
                  beautiful 3C coils that spiraled with the same determination as 
                  her ancestors. But this beautiful complexity became a source of 
                  confusion and frustration. Her mother, despite her boundless love, 
                  had no resources, no knowledge, and no understanding of how to care 
                  for these magnificent curls that defied every brush and comb.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  The Struggle: Years of Misunderstanding
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Picture a young girl, standing in front of the mirror, tears 
                  streaming down her face as another brush gets stuck in the 
                  impossible tangles. The frizz that seemed to have a life of its 
                  own, the uneven textures that refused to cooperate, the heat 
                  damage from desperate attempts to straighten what society deemed 
                  &quot;unmanageable.&quot; Every morning became a battle, every wash day a 
                  source of anxiety.
                </p>
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  The Realization: You Are Not Alone
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  For decades, curly-haired individuals have been told they look 
                  &quot;unkept,&quot; that their natural texture is somehow wrong or 
                  unprofessional. The lack of resources is astounding—the 
                  disorganization of information, the conflicting advice, the 
                  overwhelming complexity of what should be simple: loving and 
                  caring for the hair you were born with.
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  The Mission: Your Curly Hair Expert
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  This platform was created for every person who has ever felt 
                  trapped in their tuft, who has struggled through impossible knots, 
                  who has been told their natural beauty isn&apos;t enough. It&apos;s for the 
                  Miwas of the world—the biracial children, the misunderstood teens, 
                  the adults still learning to love their curls after years of 
                  fighting them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Celebrity Inspiration Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Celebrity Curl Inspiration: Embracing Every Hair Type
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Discover how celebrities with different curl patterns embrace their natural beauty 
            and inspire millions around the world.
          </p>

          {/* Type 2A - Wavy Hair */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/curly-hair-images/hair_type_2a.png" 
                alt="Type 2A Wavy Hair" 
                width={80} 
                height={80} 
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Type 2A: Loose Waves</h3>
                <p className="text-gray-600">Gentle, barely-there waves that add subtle texture</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Blake Lively</h4>
                <p className="text-gray-600 text-sm mb-3">Known for her signature beachy waves and effortless glamour</p>
                <p className="text-gray-500 text-xs">Tip: Use sea salt spray for that perfect beach wave look</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Gisele Bündchen</h4>
                <p className="text-gray-600 text-sm mb-3">Brazilian beauty with naturally tousled, carefree waves</p>
                <p className="text-gray-500 text-xs">Tip: Embrace the natural texture with minimal styling</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Kate Hudson</h4>
                <p className="text-gray-600 text-sm mb-3">Golden waves that perfectly complement her sunny personality</p>
                <p className="text-gray-500 text-xs">Tip: Use a diffuser to enhance natural wave pattern</p>
              </div>
            </div>
          </div>

          {/* Type 2B - Wavy Hair */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/curly-hair-images/hair_type_2b.jpeg" 
                alt="Type 2B Wavy Hair" 
                width={80} 
                height={80} 
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Type 2B: Defined Waves</h3>
                <p className="text-gray-600">More pronounced S-shaped waves with natural volume</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Taylor Swift</h4>
                <p className="text-gray-600 text-sm mb-3">Signature bangs and defined waves that frame her face perfectly</p>
                <p className="text-gray-500 text-xs">Tip: Use a curling wand to enhance natural wave definition</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Shakira</h4>
                <p className="text-gray-600 text-sm mb-3">Colombian singer with naturally bouncy, energetic waves</p>
                <p className="text-gray-500 text-xs">Tip: Layer products for maximum hold and definition</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Sandra Bullock</h4>
                <p className="text-gray-600 text-sm mb-3">Classic Hollywood waves that never go out of style</p>
                <p className="text-gray-500 text-xs">Tip: Use a wide-tooth comb to maintain wave separation</p>
              </div>
            </div>
          </div>

          {/* Type 2C - Wavy Hair */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/curly-hair-images/hair_type_2c.jpg" 
                alt="Type 2C Wavy Hair" 
                width={80} 
                height={80} 
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Type 2C: Strong Waves</h3>
                <p className="text-gray-600">Thick, well-defined waves that border on curls</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Julia Roberts</h4>
                <p className="text-gray-600 text-sm mb-3">Iconic thick waves that became her signature look</p>
                <p className="text-gray-500 text-xs">Tip: Use a microfiber towel to reduce frizz</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Nicole Kidman</h4>
                <p className="text-gray-600 text-sm mb-3">Australian beauty with naturally voluminous waves</p>
                <p className="text-gray-500 text-xs">Tip: Apply products to soaking wet hair for best results</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Sarah Jessica Parker</h4>
                <p className="text-gray-600 text-sm mb-3">Carrie Bradshaw&apos;s iconic thick, bouncy waves</p>
                <p className="text-gray-500 text-xs">Tip: Use a silk pillowcase to preserve waves overnight</p>
              </div>
            </div>
          </div>

          {/* Type 3A - Curly Hair */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/curly-hair-images/hair_type_3a.jpg" 
                alt="Type 3A Curly Hair" 
                width={80} 
                height={80} 
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Type 3A: Loose Curls</h3>
                <p className="text-gray-600">Large, loose curls with lots of volume and bounce</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Beyoncé</h4>
                <p className="text-gray-600 text-sm mb-3">Queen Bey&apos;s iconic voluminous curls that command attention</p>
                <p className="text-gray-500 text-xs">Tip: Use a wide-tooth comb to detangle gently</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Rihanna</h4>
                <p className="text-gray-600 text-sm mb-3">Barbadian beauty with naturally bouncy, defined curls</p>
                <p className="text-gray-500 text-xs">Tip: Apply leave-in conditioner for moisture retention</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Adele</h4>
                <p className="text-gray-600 text-sm mb-3">British singer with classic, elegant curl definition</p>
                <p className="text-gray-500 text-xs">Tip: Use a diffuser attachment for controlled drying</p>
              </div>
            </div>
          </div>

          {/* Type 3B - Curly Hair */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/curly-hair-images/hair_type_3b.jpg" 
                alt="Type 3B Curly Hair" 
                width={80} 
                height={80} 
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Type 3B: Medium Curls</h3>
                <p className="text-gray-600">Medium-sized curls with springy, well-defined spirals</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Zendaya</h4>
                <p className="text-gray-600 text-sm mb-3">Young actress with naturally defined, bouncy curls</p>
                <p className="text-gray-500 text-xs">Tip: Use a curl cream to enhance definition</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Lupita Nyong&apos;o</h4>
                <p className="text-gray-600 text-sm mb-3">Kenyan-Mexican actress with stunning natural curl definition</p>
                <p className="text-gray-500 text-xs">Tip: Apply products in sections for even distribution</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Yara Shahidi</h4>
                <p className="text-gray-600 text-sm mb-3">Actress and activist with naturally beautiful curl patterns</p>
                <p className="text-gray-500 text-xs">Tip: Use a satin bonnet to protect curls while sleeping</p>
              </div>
            </div>
          </div>

          {/* Type 3C - Curly Hair */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/curly-hair-images/hair_type_3c.jpg" 
                alt="Type 3C Curly Hair" 
                width={80} 
                height={80} 
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Type 3C: Tight Curls</h3>
                <p className="text-gray-600">Tight, well-defined curls with lots of texture and volume</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Solange Knowles</h4>
                <p className="text-gray-600 text-sm mb-3">Artist with iconic natural curls and bold style choices</p>
                <p className="text-gray-500 text-xs">Tip: Use the LOC method (Liquid, Oil, Cream) for moisture</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Tessa Thompson</h4>
                <p className="text-gray-600 text-sm mb-3">Actress with naturally defined, voluminous curl patterns</p>
                <p className="text-gray-500 text-xs">Tip: Finger coil for enhanced definition</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Issa Rae</h4>
                <p className="text-gray-600 text-sm mb-3">Creator and actress with naturally beautiful tight curls</p>
                <p className="text-gray-500 text-xs">Tip: Use a deep conditioner weekly for moisture</p>
              </div>
            </div>
          </div>

          {/* Type 4A - Coily Hair */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/curly-hair-images/hair_type_4a.jpg" 
                alt="Type 4A Coily Hair" 
                width={80} 
                height={80} 
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Type 4A: Coily Hair</h3>
                <p className="text-gray-600">Tight coils with an S-pattern and lots of shrinkage</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Lauryn Hill</h4>
                <p className="text-gray-600 text-sm mb-3">Iconic singer with natural coils that defined a generation</p>
                <p className="text-gray-500 text-xs">Tip: Use a leave-in conditioner for daily moisture</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Jill Scott</h4>
                <p className="text-gray-600 text-sm mb-3">Singer with naturally beautiful, well-defined coils</p>
                <p className="text-gray-500 text-xs">Tip: Use the shingling method for definition</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Angela Bassett</h4>
                <p className="text-gray-600 text-sm mb-3">Actress with elegant, sophisticated coil patterns</p>
                <p className="text-gray-500 text-xs">Tip: Use a wide-tooth comb for gentle detangling</p>
              </div>
            </div>
          </div>

          {/* Type 4B - Coily Hair */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/curly-hair-images/hair_type_4b.png" 
                alt="Type 4B Coily Hair" 
                width={80} 
                height={80} 
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Type 4B: Coily Hair</h3>
                <p className="text-gray-600">Zigzag pattern with less definition but lots of volume</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Janelle Monáe</h4>
                <p className="text-gray-600 text-sm mb-3">Artist with bold, artistic expressions of natural texture</p>
                <p className="text-gray-500 text-xs">Tip: Use a curl activator for enhanced definition</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Tracee Ellis Ross</h4>
                <p className="text-gray-600 text-sm mb-3">Actress and natural hair advocate with stunning coils</p>
                <p className="text-gray-500 text-xs">Tip: Use the wash-and-go method for natural definition</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Danai Gurira</h4>
                <p className="text-gray-600 text-sm mb-3">Actress with naturally beautiful, well-maintained coils</p>
                <p className="text-gray-500 text-xs">Tip: Use a protein treatment monthly for strength</p>
              </div>
            </div>
          </div>

          {/* Type 4C - Coily Hair */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/curly-hair-images/hair_type_4c.jpg" 
                alt="Type 4C Coily Hair" 
                width={80} 
                height={80} 
                className="rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Type 4C: Coily Hair</h3>
                <p className="text-gray-600">Tightest coil pattern with maximum shrinkage and volume</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Viola Davis</h4>
                <p className="text-gray-600 text-sm mb-3">Academy Award winner with naturally beautiful coils</p>
                <p className="text-gray-500 text-xs">Tip: Use a moisturizing shampoo and conditioner</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Marsai Martin</h4>
                <p className="text-gray-600 text-sm mb-3">Young actress with naturally defined, beautiful coils</p>
                <p className="text-gray-500 text-xs">Tip: Use a curl sponge for enhanced definition</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Amandla Stenberg</h4>
                <p className="text-gray-600 text-sm mb-3">Actress and activist with stunning natural coil patterns</p>
                <p className="text-gray-500 text-xs">Tip: Use the twist-out method for defined coils</p>
              </div>
            </div>
          </div>

          {/* Inspiration Call to Action */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Find Your Curl Inspiration
            </h3>
            <p className="text-gray-600 mb-6">
              Every curl pattern is beautiful and unique. Let these celebrities inspire you 
              to embrace your natural texture and discover your own signature style.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors duration-300"
            >
              Discover Your Hair Type
            </Link>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Embrace Your Natural Curls?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let us help you discover the beauty that&apos;s been there all along. 
            Your curls are not a problem to be solved—they&apos;re a gift to be celebrated.
          </p>
          <div className="space-x-4">
            <Link 
              href="/" 
              className="inline-block bg-success text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-success-100 transition-colors duration-300"
            >
              Start Your Journey
            </Link>
            <Link 
              href="/routine" 
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-400 hover:text-white transition-colors duration-300"
            >
              Explore Routines
            </Link>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💜</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Embrace Your Natural Beauty
            </h3>
            <p className="text-gray-600">
              Every curl pattern is unique and beautiful. Learn to love what makes you special.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌟</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Expert Guidance
            </h3>
            <p className="text-gray-600">
              Get personalized advice and routines tailored to your specific curl type and needs.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Community Support
            </h3>
            <p className="text-gray-600">
              Join a community of curly-haired individuals who understand your journey.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-lg italic">
            &quot;Your curls are not just hair—they&apos;re a story, a heritage, a celebration 
            of everything that makes you uniquely beautiful.&quot;
          </p>
          <p className="mt-4 text-sm">
            — Dedicated to Miwa Tucker and all curly-haired individuals everywhere
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPageComponent;
