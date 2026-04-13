import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="p-4 md:w-1/2">
    <div
      className="overflow-hidden border"
      style={{ borderColor: 'var(--c-split)', backgroundColor: 'var(--c-mantle)' }}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`前往 ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-xl leading-8 font-bold tracking-tight text-[var(--c-text)]">
          {href ? (
            <Link href={href} aria-label={`前往 ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="mb-4 font-mono text-sm text-[var(--c-subtext0)]">{description}</p>
        {href && (
          <Link
            href={href}
            className="font-mono text-sm text-[var(--c-blue)] transition-opacity hover:opacity-75"
            aria-label={`前往 ${title}`}
          >
            [查看项目] →
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
