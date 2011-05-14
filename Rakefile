require 'yaml'
require 'fileutils'

desc 'Package the library and create both compressed and uncompressed versions. Process the result with jslint'
task :build => [:prepare, :package, :minify, :lint] do
  puts "Building #{fetch_options['name']}"
end

desc 'Package only a compiled version of the file'
task :package => :prepare do
  
  opts = fetch_options
  puts "Packaging #{opts['name']} to #{opts['output']['default']}"  
  sourcedir   = File.expand_path(".", opts['paths']['src'])
  destdir     = File.expand_path(".", opts['paths']['dist'])
  distpath    = "#{destdir}/#{opts['version']}"
  sourcefiles = [opts['input']].flatten.map do |path|
    gsub_file(read_file("#{sourcedir}/#{path}"))
  end.join("\n\n")
  
  copyright = gsub_file(read_file(File.expand_path(".", "#{opts['paths']['build']}/copyright.txt")))
  File.open("#{distpath}/#{opts['output']['default']}", 'w'){ |f| f.write([copyright, sourcefiles].join("\n\n")) }
  puts "Done..."
  
end

desc 'Package and minify'
task :minify => [:prepare, :package] do
  
  opts = fetch_options
  puts "Minifying #{opts['name']} to #{opts['output']['minified']}"

  distpath    = "#{opts['paths']['dist']}/#{opts['version']}"
  sourcefile  = File.expand_path(".", "#{distpath}/#{opts['output']['default']}")
  destfile    = File.expand_path(".", "#{distpath}/#{opts['output']['minified']}")
  tempfile    = "#{destfile}.tmp"
  puts `#{ENV['COMPILER']} #{sourcefile} > #{tempfile}`
  puts `#{ENV['POST_COMPILER']} #{tempfile} > #{destfile}`
  system "rm #{tempfile}"
  copyright = gsub_file(read_file(File.expand_path(".", "#{opts['paths']['build']}/copyright.txt")))
  puts 'Adding copyright'
  minified  = read_file(destfile)
  File.open("#{destfile}", 'w'){ |f| f.write([copyright, minified].join("\n\n")) }  
  puts "Done..."
  
end

desc 'JSLint the packaged file'
task :lint => [:prepare, :package] do
  
end

desc 'Clean dist folders'
task :clean do
  options = fetch_options
  system("rm -rf dist/#{options['version']}")
end

desc 'Setup globals'
task :prepare do
  options                = fetch_options
  build_dir              = File.expand_path('.', options['paths']['build'])
  ENV['JS_ENGINE']       = (`which node nodejs`).to_s.gsub("\n",'')
  ENV['COMPILER']        = "#{ENV['JS_ENGINE']} #{build_dir}/uglify.js --unsafe"
  ENV['POST_COMPILER']   = "#{ENV['JS_ENGINE']} #{build_dir}/post-compile.js"
  dist_path = File.expand_path('.', options['paths']['dist'])
  FileUtils.mkdir_p(File.join(dist_path, options['version']))
  puts "Creating distribution path... #{dist_path}/#{options['version']}"
end

task :default => :build

def gsub_file(content)
  content.gsub("@DATE", Date.today.year.to_s).gsub("@VERSION", fetch_options['version']).gsub('@DEBUG', fetch_options['debug'])
end

def fetch_options
  YAML::load(File.open(File.expand_path('.', "build.yml")))
end

def read_file(path)
  File.open(path, 'rb') { |f| f.read }
end
