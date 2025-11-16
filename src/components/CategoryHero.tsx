interface CategoryHeroProps {
  category: 'men' | 'women' | 'unisex';
}

const categoryData = {
  men: {
    title: "Men's Clothing",
    image: 'https://images.pexels.com/photos/3622617/pexels-photo-3622617.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  women: {
    title: "Women's Clothing",
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  unisex: {
    title: 'Unisex Collection',
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
};

export default function CategoryHero({ category }: CategoryHeroProps) {
  const data = categoryData[category];

  return (
    <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${data.image}')` }}
      ></div>

      <div className="relative z-10 text-center">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-2xl">
          {data.title}
        </h2>
      </div>
    </section>
  );
}
